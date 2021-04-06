const { ipcRenderer, contextBridge } = require('electron');


contextBridge.exposeInMainWorld('api', {
  search: (value) => ipcRenderer.invoke('search', value),

  searchEnd: () => ipcRenderer.invoke('searchEnd'),
});

