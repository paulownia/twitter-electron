'use strict';

import { app } from 'electron';

import { initConfig } from './config.js';
import { initMenu } from './menu.js';
import { timelineView } from './view.js';


app.whenReady()
  .then(() => initConfig())
  .then(() => {
    initMenu();
    timelineView.show();
    app.on('activate', () => {
      timelineView.show();
    });
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

