const { app, BrowserWindow, ipcMain, shell, session, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, execFile } = require('child_process');
const http = require('http');

let splashWindow;
let mainWindow;
let apiProcess;
let webProcess;
let dockerStarted = false;

function getRootDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'root');
  }
  return path.join(__dirname, '..', '..', '..');
}

function updateStatus(message) {
  console.log('[Desktop]', message);
  if (splashWindow && !splashWindow.isDestroyed()) {
    splashWindow.webContents.executeJavaScript(
      `document.getElementById('status').textContent = ${JSON.stringify(message)}`
    );
  }
}

function showError(title, message) {
  dialog.showErrorBox(title, message);
}

function waitForUrl(url, timeout = 120000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tryConnect = () => {
      const req = http.get(url, { timeout: 2000 }, (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          retry(`status ${res.statusCode}`);
        }
      });
      req.on('error', () => retry('error'));
      req.on('timeout', () => {
        req.destroy();
        retry('timeout');
      });

      function retry(reason) {
        if (Date.now() - start > timeout) {
          reject(new Error(`Timed out waiting for ${url} (${reason})`));
        } else {
          setTimeout(tryConnect, 1000);
        }
      }
    };
    tryConnect();
  });
}

function runCommand(bin, args, options) {
  return new Promise((resolve, reject) => {
    const proc = spawn(bin, args, { stdio: 'pipe', ...options });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });
    proc.on('error', (err) => reject(err));
    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${bin} ${args.join(' ')} exited with ${code}: ${stderr || stdout}`));
      } else {
        resolve(stdout);
      }
    });
  });
}

function isDockerAvailable() {
  return new Promise((resolve) => {
    const proc = spawn('docker', ['compose', 'version'], { stdio: 'ignore' });
    proc.on('error', () => resolve(false));
    proc.on('close', (code) => resolve(code === 0));
  });
}

function ensureEnvFile(root) {
  const envPath = path.join(root, '.env');
  if (fs.existsSync(envPath)) return;
  const envContent = `# EduVision Desktop environment
POSTGRES_USER=eduvision
POSTGRES_PASSWORD=eduvision
POSTGRES_DB=eduvision
DATABASE_URL=postgresql://eduvision:eduvision@localhost:5432/eduvision?schema=public
REDIS_URL=redis://localhost:6379
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
JWT_SECRET=change-me-to-a-long-random-string
TOTP_SECRET=change-me-to-a-32-char-secret-for-2fa
EMAIL_FROM=noreply@eduvision.local
`;
  fs.writeFileSync(envPath, envContent, 'utf8');
}

async function startDockerServices(root) {
  const composeFile = path.join(root, 'docker-compose.desktop.yml');
  if (!fs.existsSync(composeFile)) {
    throw new Error(`Desktop compose file not found at ${composeFile}`);
  }
  ensureEnvFile(root);
  updateStatus('Starting PostgreSQL, Redis and backend services...');
  await runCommand('docker', ['compose', '-f', composeFile, '-p', 'eduvision-desktop', 'up', '-d', '--build'], { cwd: root });
  dockerStarted = true;
  updateStatus('Waiting for services to become healthy...');
  await waitForUrl('http://localhost:4000/health');
  await waitForUrl('http://localhost:3000/api/health');
}

async function stopDockerServices(root) {
  const composeFile = path.join(root, 'docker-compose.desktop.yml');
  if (!fs.existsSync(composeFile)) return;
  try {
    await runCommand('docker', ['compose', '-f', composeFile, '-p', 'eduvision-desktop', 'down'], { cwd: root });
  } catch (err) {
    console.error('[Desktop] Failed to stop Docker services:', err.message);
  }
}

function startNodeServices() {
  const root = getRootDir();
  const apiPort = process.env.API_PORT || '4000';
  const webPort = process.env.WEB_PORT || '3000';
  const schoolSlug = process.env.SCHOOL_SLUG || 'demo-school';

  updateStatus('Starting local API server...');

  const apiScript = app.isPackaged
    ? path.join(process.resourcesPath, 'api', 'dist', 'src', 'main.js')
    : path.join(root, 'apps', 'api', 'dist', 'src', 'main.js');

  const webScript = app.isPackaged
    ? path.join(process.resourcesPath, 'web', 'apps', 'web', 'server.js')
    : path.join(root, 'apps', 'web', '.next', 'standalone', 'apps', 'web', 'server.js');

  const apiCwd = app.isPackaged ? path.dirname(apiScript) : root;
  const webCwd = app.isPackaged ? path.dirname(webScript) : root;

  const nodeBin = app.isPackaged ? process.execPath : 'node';

  apiProcess = spawn(nodeBin, [apiScript], {
    cwd: apiCwd,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      ...(app.isPackaged ? { ELECTRON_RUN_AS_NODE: '1' } : {}),
      PORT: apiPort,
      API_URL: `http://localhost:${apiPort}`,
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
      API_URL: `http://localhost:${apiPort}`,
      DISABLE_ADMIN: 'true',
    },
    stdio: 'pipe',
  });
  webProcess.on('error', (err) => console.error('[Web] spawn error:', err));
  webProcess.on('exit', (code) => console.log(`Web exited with code ${code}`));
  webProcess.stdout.on('data', (d) => process.stdout.write(`[Web] ${d.toString()}`));
  webProcess.stderr.on('data', (d) => process.stderr.write(`[Web] ${d.toString()}`));

  return waitForUrl(`http://localhost:${apiPort}/health`)
    .then(() => waitForUrl(`http://localhost:${webPort}/api/health`));
}

async function startServices() {
  const root = getRootDir();
  const apiPort = process.env.API_PORT || '4000';
  const webPort = process.env.WEB_PORT || '3000';

  // If services are already running, skip starting.
  try {
    await waitForUrl(`http://localhost:${apiPort}/health`, 3000);
    await waitForUrl(`http://localhost:${webPort}/api/health`, 3000);
    updateStatus('Services are already running.');
    return;
  } catch {
    // continue
  }

  const docker = await isDockerAvailable();
  if (docker) {
    try {
      await startDockerServices(root);
      return;
    } catch (err) {
      console.error('[Desktop] Docker start failed:', err.message);
      updateStatus('Docker start failed, falling back to local Node services...');
    }
  }

  if (!docker && app.isPackaged) {
    throw new Error('Docker is not available. Please install Docker and Docker Compose, then launch EduVision again.');
  }

  await startNodeServices();
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

  const filter = { urls: [`http://localhost:${webPort}/*`, `http://127.0.0.1:${webPort}/*`] };
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    details.requestHeaders['x-school-slug'] = schoolSlug;
    callback({ requestHeaders: details.requestHeaders });
  });

  mainWindow.loadURL(`http://localhost:${webPort}`);

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
    await stopDockerServices(getRootDir());
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
    await stopDockerServices(getRootDir());
  }
});
