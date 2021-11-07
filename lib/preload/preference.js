const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {

  getExternalBrowser: () => ipcRenderer.invoke('getExternalBrowser'),

  setExternalBrowser: (name) => ipcRenderer.invoke('setExternalBrowser', name),
});

