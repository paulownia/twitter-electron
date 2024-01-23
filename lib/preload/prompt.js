const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('api', {
  /**
   * invoke prompt-complete event
   * @param {*} url
   * @returns promise
   */
  promptComplete: (value, button) => ipcRenderer.invoke('prompt-complete', value, button),
});
