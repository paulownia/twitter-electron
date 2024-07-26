'use strict';

const { app } = require('electron');

const config = require('./config');
const menu = require('./menu');
const view = require('./view');

app.on('ready', async () => {
  await config.init();
  menu.init();
  view.timelineView.loadXPage('/');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  view.timelineView.show();
});

