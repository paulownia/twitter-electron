// In preload script, esm is not supported. So, we use require instead of import.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {

  getExternalBrowser: () => ipcRenderer.invoke('get-preference', 'externalBrowser'),

  setExternalBrowser: (name) => ipcRenderer.invoke('set-preference', 'externalBrowser', name),

  getCacheSize: () => ipcRenderer.invoke('get-cache-size'),

  clearCache: () => ipcRenderer.invoke('clear-cache'),
});
