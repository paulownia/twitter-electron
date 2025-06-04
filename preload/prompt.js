// In preload script, esm is not supported. So, we use require instead of import.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  /**
   * invoke prompt-complete event
   * @param {*} url
   * @returns promise
   */
  promptComplete: (value, button) => ipcRenderer.invoke('prompt-complete', value, button),
});
