'use strict';

const { app, ipcMain } = require('electron');

const config = require('./lib/config');
const menu = require('./lib/menu');
const browser = require('./lib/browser');

app.on('ready', () => {
  config.init();
  menu.init();
  browser.init(true);
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
