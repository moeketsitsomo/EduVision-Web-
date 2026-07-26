const { app, BrowserWindow, ipcMain, shell, session } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let apiProcess;
let webProcess;

function getRootDir() {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'root');
  }
  return path.join(__dirname, '..', '..', '..');
}

function waitForUrl(url, timeout = 60000) {
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
          setTimeout(tryConnect, 500);
        }
      }
    };
    tryConnect();
  });
}

function startServices() {
  const root = getRootDir();
  const apiPort = process.env.API_PORT || '4000';
  const webPort = process.env.WEB_PORT || '3000';
  const schoolSlug = process.env.SCHOOL_SLUG || 'demo-school';

  console.log('[Desktop] Starting services from', root);
  console.log('[Desktop] API port', apiPort, 'Web port', webPort, 'School slug', schoolSlug);

  const apiScript = app.isPackaged
    ? path.join(process.resourcesPath, 'api', 'dist', 'src', 'main.js')
    : path.join(root, 'apps', 'api', 'dist', 'src', 'main.js');

  const webScript = app.isPackaged
    ? path.join(process.resourcesPath, 'web', 'apps', 'web', 'server.js')
    : path.join(root, 'apps', 'web', '.next', 'standalone', 'apps', 'web', 'server.js');

  const apiCwd = app.isPackaged ? path.dirname(apiScript) : root;
  const webCwd = app.isPackaged ? path.dirname(webScript) : root;

  // In packaged builds we use the Electron runtime as Node.
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
  console.log('[Desktop] API pid', apiProcess.pid);
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
  console.log('[Desktop] Web pid', webProcess.pid);
  webProcess.on('error', (err) => console.error('[Web] spawn error:', err));
  webProcess.on('exit', (code) => console.log(`Web exited with code ${code}`));
  webProcess.stdout.on('data', (d) => process.stdout.write(`[Web] ${d.toString()}`));
  webProcess.stderr.on('data', (d) => process.stderr.write(`[Web] ${d.toString()}`));

  // Wait for the API first, then the web server.
  return waitForUrl(`http://localhost:${apiPort}/health`)
    .then(() => waitForUrl(`http://localhost:${webPort}/api/health`));
}

function createWindow() {
  const webPort = process.env.WEB_PORT || '3000';
  const schoolSlug = process.env.SCHOOL_SLUG || 'demo-school';

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'EduVision School Website',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '..', 'assets', 'icon.png'),
    show: false,
  });

  mainWindow.once('ready-to-show', () => {
    console.log('[Desktop] Window ready, showing');
    mainWindow.show();
  });

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('[Desktop] Failed to load:', errorCode, errorDescription);
  });

  // Ensure the desktop app always resolves the configured school tenant.
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
  try {
    await startServices();
    console.log('[Desktop] Services ready, creating window');
    createWindow();
  } catch (err) {
    console.error('Failed to start EduVision desktop:', err);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (apiProcess) apiProcess.kill();
  if (webProcess) webProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('will-quit', () => {
  if (apiProcess) apiProcess.kill();
  if (webProcess) webProcess.kill();
});
