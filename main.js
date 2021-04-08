'use strict';

const { app, ipcMain } = require('electron');

const config = require('./lib/config');
const menu = require('./lib/menu');
const browser = require('./lib/browser');

app.on('ready', async () => {
  await config.init();
  menu.init();
  browser.init();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  browser.init(true);
});

ipcMain.handle('search', (_event, ...args) => {
  browser.search(args[0]);
});

ipcMain.handle('searchEnd', (_event) => {
  browser.searchEnd();
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
