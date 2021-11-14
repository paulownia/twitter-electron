const { ipcMain } = require('electron');

const config = require('./config');
const view = require('./view');

ipcMain.handle('search', (_event, ...[query, type]) => {
  view.timelineView.search(query, type);
});

ipcMain.handle('searchEnd', (_event) => {
  view.searchView.close();
});

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
