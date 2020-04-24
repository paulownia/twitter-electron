const {ipcRenderer} = require('electron');

process.once('loaded', () => {
  global.sendMessageToHost = (channel, ...message) => {
    ipcRenderer.send(channel, ...message);
  };
});
