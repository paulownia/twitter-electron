'use strict';

const { app } = require('electron');

const { initConfig } = require('./config');
const { initMenu } = require('./menu');
const { timelineView } = require('./view');

app.on('ready', async () => {
  await initConfig();
  initMenu();
  timelineView.loadXPage('/');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  timelineView.show();
});

