'use strict';

const { app, ipcMain } = require('electron');

const config = require('./lib/config');
const menu = require('./lib/menu');
const view = require('./lib/view');

app.on('ready', async () => {
  await config.init();
  menu.init();
  view.timelineView.loadHomePage();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  view.timelineView.show();
});

ipcMain.handle('search', (_event, ...args) => {
  view.timelineView.search(args[0], args[1]);
});

ipcMain.handle('searchEnd', (_event) => {
  view.searchView.close();
});

ipcMain.handle('getSearchType', (_event) => {
  return view.searchView.searchType;
});

ipcMain.handle('setExternalBrowser', (_event, ...args) => {
  const browser = args[0];
  if (browser === config.get('externalBrowser')) {
    return;
  }
  config.set('externalBrowser', args[0]);
  config.save();
});

ipcMain.handle('getExternalBrowser', (_event) => {
  return config.get('externalBrowser');
});
