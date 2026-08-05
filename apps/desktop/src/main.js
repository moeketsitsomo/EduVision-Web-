const { app, BrowserWindow, ipcMain, shell, session, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const http = require('http');
const net = require('net');

let splashWindow;
let mainWindow;
let apiProcess;
let webProcess;
let dockerStarted = false;

const COMPOSE_TIMEOUT = 10 * 60 * 1000; // 10 minutes for build/pull

function getInstallRoot() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'root');
  }
  return path.join(__dirname, '..', '..', '..');
}

function getWorkingRoot() {
  if (app.isPackaged) {
    const dir = path.join(app.getPath('userData'), 'eduvision');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }
  return getInstallRoot();
}

function updateStatus(message) {
  console.log('[Desktop]', message);
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.executeJavaScript(
      `document.getElementById('status').textContent = ${JSON.stringify(message)}`
    ).catch(() => {});
  }
}

function showError(title, message) {
  dialog.showErrorBox(title, message);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isPortInUse(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let settled = false;

    socket.setTimeout(1000);
    socket.once('connect', () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(true);
      }
    });
    socket.once('timeout', () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.once('error', () => {
      if (!settled) {
        settled = true;
        socket.destroy();
        resolve(false);
      }
    });
    socket.connect(port, host);
  });
}

function waitForUrl(url, timeout = 120000, label = url) {
  const start = Date.now();
  let lastReason = 'no response';
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const req = http.get(url, { timeout: 2000, family: 4 }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          lastReason = `HTTP ${res.statusCode}`;
          retry(lastReason);
        }
      });
      req.on('error', (err) => {
        lastReason = err.message;
        retry(lastReason);
      });
      req.on('timeout', () => {
        lastReason = 'connection timeout';
        req.destroy();
        retry(lastReason);
      });

      function retry(reason) {
        if (Date.now() - start > timeout) {
          reject(new Error(`Timed out waiting for ${label} (${lastReason})`));
        } else {
          setTimeout(tryConnect, 1000);
        }
      }
    };
    tryConnect();
  });
}

function runCommand(bin, args, options = {}) {
  const { cwd, log = true, timeout, env } = options;
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, { cwd, env: env ? { ...process.env, ...env } : process.env, stdio: 'pipe' });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let timer;

    if (timeout) {
      timer = setTimeout(() => {
        timedOut = true;
        proc.kill('SIGTERM');
      }, timeout);
    }

    proc.stdout.on('data', (d) => {
      const s = d.toString();
      stdout += s;
      if (log) {
        process.stdout.write(`[${bin}] ${s}`);
      }
    });

    proc.stderr.on('data', (d) => {
      const s = d.toString();
      stderr += s;
      if (log) {
        process.stderr.write(`[${bin}] ${s}`);
      }
    });

    proc.on('error', (err) => {
      if (timer) clearTimeout(timer);
      reject(err);
    });

    proc.on('close', (code) => {
      if (timer) clearTimeout(timer);
      if (timedOut) {
        reject(new Error(`${bin} ${args.join(' ')} timed out after ${timeout}ms. stdout: ${stdout} stderr: ${stderr}`));
      } else if (code !== 0) {
        reject(new Error(`${bin} ${args.join(' ')} exited with code ${code}. stdout: ${stdout} stderr: ${stderr}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

function checkCommand(bin, args, options = {}) {
  return new Promise((resolve) => {
    const proc = spawn(bin, args, { ...options, stdio: 'pipe' });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', () => resolve({ ok: false, stdout, stderr: 'command not found' }));
    proc.on('close', (code) => resolve({ ok: code === 0, stdout, stderr }));
  });
}

async function ensureDocker() {
  updateStatus('Checking Docker installation...');
  const dockerVersion = await checkCommand('docker', ['--version']);
  if (!dockerVersion.ok) {
    throw new Error('Docker is not installed.\n\nPlease install Docker Engine and Docker Compose v2, then launch EduVision again.\nSee https://docs.docker.com/engine/install/');
  }

  updateStatus('Checking Docker daemon...');
  const daemonCheck = await checkCommand('docker', ['info']);
  if (!daemonCheck.ok) {
    updateStatus('Docker daemon is not running. Attempting to start it...');
    const startAttempt = await checkCommand('sudo', ['-n', 'systemctl', 'start', 'docker']);
    if (!startAttempt.ok) {
      throw new Error(`Docker is installed but the daemon is not running and could not be started automatically.\n\nPlease start Docker manually:\n  sudo systemctl start docker\n\nOriginal error: ${daemonCheck.stderr || daemonCheck.stdout || 'unknown'}`);
    }
    await sleep(3000);
    const recheck = await checkCommand('docker', ['info']);
    if (!recheck.ok) {
      throw new Error('Docker daemon was started but is still not responding. Please check Docker status and try again.');
    }
  }

  updateStatus('Checking Docker Compose...');
  const composeCheck = await checkCommand('docker', ['compose', 'version']);
  if (!composeCheck.ok) {
    throw new Error(`Docker is installed but Docker Compose v2 is not available.\n\nPlease install the Docker Compose plugin.\nError: ${composeCheck.stderr || composeCheck.stdout}`);
  }
}

function ensureEnvFile(root) {
  const envPath = path.join(root, '.env');
  if (fs.existsSync(envPath)) return;
  const jwtSecret = [...Array(64)].map(() => Math.random().toString(36)[2]).join('');
  const totpSecret = [...Array(32)].map(() => Math.random().toString(36)[2]).join('');
  const envContent = `# EduVision Desktop environment
POSTGRES_USER=eduvision
POSTGRES_PASSWORD=eduvision
POSTGRES_DB=eduvision
DATABASE_URL=postgresql://eduvision:eduvision@postgres:5432/eduvision?schema=public
REDIS_URL=redis://redis:6379
API_PORT=4000
WEB_PORT=3000
API_URL=http://localhost:4000
NEXT_PUBLIC_API_URL=
NODE_ENV=production
DEFAULT_SCHOOL_SLUG=demo-school
STORAGE_TYPE=local
STORAGE_LOCAL_ROOT=uploads
STORAGE_BASE_URL=http://localhost:4000
MAX_UPLOAD_SIZE_MB=50
JWT_SECRET=${jwtSecret}
TOTP_SECRET=${totpSecret}
EMAIL_FROM=noreply@eduvision.local
`;
  fs.writeFileSync(envPath, envContent, 'utf8');
}

function prepareComposeFile(installRoot, workingRoot) {
  const composeSource = path.join(installRoot, 'docker-compose.desktop.yml');
  if (!fs.existsSync(composeSource)) {
    throw new Error(`Desktop compose file not found at ${composeSource}`);
  }

  // In development the working root is the repository itself, so we can use
  // the original compose file. In packaged builds the install root is
  // read-only and we need a writable copy with an absolute build context.
  if (workingRoot === installRoot) {
    return path.basename(composeSource);
  }

  const composeDest = path.join(workingRoot, 'docker-compose.desktop.yml');
  let composeContent = fs.readFileSync(composeSource, 'utf8');
  const safeRoot = installRoot.replace(/\\/g, '/');
  composeContent = composeContent.replace(/^(\s+)context:\s*\.\s*$/gm, `$1context: "${safeRoot}"`);
  fs.writeFileSync(composeDest, composeContent, 'utf8');
  return path.basename(composeDest);
}

async function waitForComposeService(project, service, command, expected, timeout = 120000) {
  const start = Date.now();
  let lastReason = '';
  while (Date.now() - start < timeout) {
    try {
      const output = await runCommand('docker', ['compose', '-p', project, 'exec', '-T', service, ...command], { log: false, timeout: 10000 });
      if (output.trim().includes(expected)) {
        return;
      }
      lastReason = `service responded but did not contain "${expected}"; got: ${output.trim()}`;
    } catch (err) {
      lastReason = err.message;
    }
    await sleep(2000);
  }
  throw new Error(`Timed out waiting for ${service} (${lastReason})`);
}

async function startDockerServices() {
  const project = 'eduvision-desktop';
  const installRoot = getInstallRoot();
  const workingRoot = getWorkingRoot();

  await ensureDocker();
  ensureEnvFile(workingRoot);

  updateStatus('Checking for already-running services...');
  try {
    await waitForUrl('http://127.0.0.1:4000/health', 3000, 'API');
    await waitForUrl('http://127.0.0.1:3000/', 3000, 'Web');
    updateStatus('Services are already running.');
    dockerStarted = true;
    return;
  } catch {
    // continue
  }

  const apiPort = process.env.API_PORT || '4000';
  const webPort = process.env.WEB_PORT || '3000';

  for (const [port, name] of [[apiPort, 'API'], [webPort, 'Web']]) {
    const inUse = await isPortInUse(port);
    if (inUse) {
      throw new Error(`Port ${port} is already in use.\n\nAnother process is listening on port ${port} but it is not responding as the EduVision ${name} service.\nPlease free port ${port} and try again.`);
    }
  }

  let composeFile;
  try {
    composeFile = prepareComposeFile(installRoot, workingRoot);
  } catch (err) {
    throw new Error(`Failed to prepare Docker Compose file.\n\n${err.message}`);
  }

  updateStatus('Starting services with Docker Compose (this may take a few minutes)...');
  try {
    await runCommand('docker', ['compose', '-f', composeFile, '-p', project, 'up', '-d', '--build'], { cwd: workingRoot, timeout: COMPOSE_TIMEOUT });
  } catch (err) {
    throw new Error(`docker compose up failed.\n\n${err.message}`);
  }
  dockerStarted = true;

  updateStatus('Waiting for PostgreSQL to become healthy...');
  await waitForComposeService(project, 'postgres', ['pg_isready', '-U', 'eduvision'], 'accepting connections', 120000);

  updateStatus('Waiting for Redis to become ready...');
  await waitForComposeService(project, 'redis', ['redis-cli', 'ping'], 'PONG', 120000);

  updateStatus('Waiting for API and database migrations on http://localhost:4000/health...');
  await waitForUrl('http://127.0.0.1:4000/health', 180000, 'API health (includes migrations)');

  updateStatus('Waiting for Web server on http://localhost:3000...');
  await waitForUrl('http://127.0.0.1:3000/', 180000, 'Web server');
}

async function stopDockerServices() {
  const workingRoot = getWorkingRoot();
  const composeFile = path.join(workingRoot, 'docker-compose.desktop.yml');
  if (!fs.existsSync(composeFile)) return;
  try {
    await runCommand('docker', ['compose', '-f', path.basename(composeFile), '-p', 'eduvision-desktop', 'down'], { cwd: workingRoot, log: false });
  } catch (err) {
    console.error('[Desktop] Failed to stop Docker services:', err.message);
  }
}

function nodeServicePath(type) {
  const installRoot = getInstallRoot();
  if (type === 'api') {
    return app.isPackaged
      ? path.join(process.resourcesPath, 'api', 'dist', 'src', 'main.js')
      : path.join(installRoot, 'apps', 'api', 'dist', 'src', 'main.js');
  }
  return app.isPackaged
    ? path.join(process.resourcesPath, 'web', 'apps', 'web', 'server.js')
    : path.join(installRoot, 'apps', 'web', '.next', 'standalone', 'apps', 'web', 'server.js');
}

async function startNodeServices() {
  const installRoot = getInstallRoot();
  const apiPort = process.env.API_PORT || '4000';
  const webPort = process.env.WEB_PORT || '3000';
  const schoolSlug = process.env.SCHOOL_SLUG || 'demo-school';

  if (app.isPackaged) {
    const apiScript = nodeServicePath('api');
    const webScript = nodeServicePath('web');
    if (!fs.existsSync(apiScript) || !fs.existsSync(webScript)) {
      throw new Error('The packaged app cannot start the backend directly.\n\nDocker is required to run EduVision. Please install Docker, start the daemon, and launch the app again.');
    }
  }

  updateStatus('Starting local API server...');

  const apiScript = nodeServicePath('api');
  const webScript = nodeServicePath('web');

  const apiCwd = app.isPackaged ? path.dirname(apiScript) : installRoot;
  const webCwd = app.isPackaged ? path.dirname(webScript) : installRoot;
  const nodeBin = app.isPackaged ? process.execPath : 'node';

  apiProcess = spawn(nodeBin, [apiScript], {
    cwd: apiCwd,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ...(app.isPackaged ? { ELECTRON_RUN_AS_NODE: '1' } : {}),
      PORT: apiPort,
      API_URL: `http://127.0.0.1:${apiPort}`,
    },
    stdio: 'pipe',
  });
  apiProcess.on('error', (err) => console.error('[API] spawn error:', err));
  apiProcess.on('exit', (code) => console.log(`API exited with code ${code}`));
  apiProcess.stdout.on('data', (d) => process.stdout.write(`[API] ${d.toString()}`));
  apiProcess.stderr.on('data', (d) => process.stderr.write(`[API] ${d.toString()}`));

  webProcess = spawn(nodeBin, [webScript], {
    cwd: webCwd,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ...(app.isPackaged ? { ELECTRON_RUN_AS_NODE: '1' } : {}),
      PORT: webPort,
      API_URL: `http://127.0.0.1:${apiPort}`,
      DISABLE_ADMIN: 'true',
    },
    stdio: 'pipe',
  });
  webProcess.on('error', (err) => console.error('[Web] spawn error:', err));
  webProcess.on('exit', (code) => console.log(`Web exited with code ${code}`));
  webProcess.stdout.on('data', (d) => process.stdout.write(`[Web] ${d.toString()}`));
  webProcess.stderr.on('data', (d) => process.stderr.write(`[Web] ${d.toString()}`));

  await waitForUrl(`http://127.0.0.1:${apiPort}/health`, 120000, 'API health');
  await waitForUrl(`http://127.0.0.1:${webPort}/`, 120000, 'Web server');
}

async function startServices() {
  const apiPort = process.env.API_PORT || '4000';
  const webPort = process.env.WEB_PORT || '3000';

  try {
    await waitForUrl(`http://127.0.0.1:${apiPort}/health`, 3000, 'API');
    await waitForUrl(`http://127.0.0.1:${webPort}/`, 3000, 'Web');
    updateStatus('Services are already running.');
    return;
  } catch {
    // continue
  }

  try {
    await startDockerServices();
    return;
  } catch (err) {
    console.error('[Desktop] Docker services failed:', err);
    if (app.isPackaged) {
      throw new Error(`Docker services could not be started.\n\n${err.message}`);
    }
    updateStatus('Docker not available, falling back to local Node services...');
    await startNodeServices();
  }
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 480,
    height: 360,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    movable: false,
    skipTaskbar: false,
    transparent: false,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
  });
  splashWindow.loadFile(path.join(__dirname, 'splash.html'));
  splashWindow.once('ready-to-show', () => splashWindow.show());
}

function createMainWindow() {
  const webPort = process.env.WEB_PORT || '3000';
  const schoolSlug = process.env.SCHOOL_SLUG || 'demo-school';

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    title: 'EduVision School Website',
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.once('ready-to-show', () => {
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.close();
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[Desktop] Failed to load:', errorCode, errorDescription);
  });

  const filter = { urls: [`http://127.0.0.1:${webPort}/*`, `http://localhost:${webPort}/*`] };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['x-school-slug'] = schoolSlug;
    callback({ requestHeaders: details.requestHeaders });
  });

  mainWindow.loadURL(`http://127.0.0.1:${webPort}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

ipcMain.on('app-close', () => {
  if (mainWindow) mainWindow.close();
});

ipcMain.on('app-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('app-maximize', () => {
  if (mainWindow) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  }
});

app.whenReady().then(async () => {
  createSplashWindow();
  try {
    await startServices();
    updateStatus('Opening EduVision...');
    createMainWindow();
  } catch (err) {
    console.error('Failed to start EduVision desktop:', err);
    updateStatus('Failed to start services.');
    showError('EduVision Desktop', err.message || 'Failed to start local services. Please check the logs and try again.');
    app.quit();
  }
});

app.on('window-all-closed', async () => {
  if (apiProcess) apiProcess.kill();
  if (webProcess) webProcess.kill();
  if (dockerStarted) {
    await stopDockerServices();
  }
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on('will-quit', async () => {
  if (apiProcess) apiProcess.kill();
  if (webProcess) webProcess.kill();
  if (dockerStarted) {
    await stopDockerServices();
  }
});
