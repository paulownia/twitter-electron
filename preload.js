const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('api', {
  search: (value, type) => ipcRenderer.invoke('search', value, type),

  searchEnd: () => ipcRenderer.invoke('searchEnd'),

  getSearchType: () => ipcRenderer.invoke('getSearchType'),

  getExternalBrowser: () => ipcRenderer.invoke('getExternalBrowser'),

  setExternalBrowser: (name) => ipcRenderer.invoke('setExternalBrowser', name),

});

