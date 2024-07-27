const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {

  getExternalBrowser: () => ipcRenderer.invoke('get-preference', 'externalBrowser'),

  setExternalBrowser: (name) => ipcRenderer.invoke('set-preference', 'externalBrowser', name),

  getCacheSize: () => ipcRenderer.invoke('get-cache-size'),

  clearCache: () => ipcRenderer.invoke('clear-cache'),

  onFailSetPreference: (callback) => ipcRenderer.on('fail-set-preference', callback),
});

