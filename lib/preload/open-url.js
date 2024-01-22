const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  /**
   * invoke open-url event
   * @param {*} url
   * @returns promise
   */
  openURL: (url) => ipcRenderer.invoke('open-url', url),
});
