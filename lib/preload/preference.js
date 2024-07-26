const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {

  getExternalBrowser: () => ipcRenderer.invoke('get-preference', 'externalBrowser'),

  setExternalBrowser: (name) => ipcRenderer.invoke('set-preference', 'externalBrowser', name),
});

