'use strict';

const { app } = require('electron');

const config = require('./config');
const menu = require('./menu');
const view = require('./view');

import('./ipc_handler.js');

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

