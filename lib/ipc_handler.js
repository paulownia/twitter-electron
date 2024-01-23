const { ipcMain } = require('electron');

const config = require('./config');

ipcMain.handle('setExternalBrowser', (_event, ...[browser]) => {
  if (browser === config.get('externalBrowser')) {
    return;
  }
  config.set('externalBrowser', browser);
  config.save();
});

ipcMain.handle('getExternalBrowser', (_event) => {
  return config.get('externalBrowser');
});
