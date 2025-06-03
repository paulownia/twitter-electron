import { app } from 'electron';
import { config } from './config.js';
import { initMenu } from './menu.js';
import { timelineView } from './view.js';

app.whenReady()
  .then(() => config.init())
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

app.on('will-quit', () => {
  config.flush();
});

