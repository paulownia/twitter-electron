'use strict';

const { app } = require('electron');

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
