const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('eduvision', {
  close: () => ipcRenderer.send('app-close'),
  minimize: () => ipcRenderer.send('app-minimize'),
  maximize: () => ipcRenderer.send('app-maximize'),
  onStatus: (callback) => ipcRenderer.on('status', callback),
});
