'use strict';

const { app, ipcMain } = require('electron');

const config = require('./config');
const menu = require('./menu');
const view = require('./view');

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

ipcMain.handle('search', (_event, ...[query, type]) => {
  view.timelineView.search(query, type);
});

ipcMain.handle('searchEnd', (_event) => {
  view.searchView.close();
});

ipcMain.handle('getSearchType', (_event) => {
  return view.searchView.searchType;
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
