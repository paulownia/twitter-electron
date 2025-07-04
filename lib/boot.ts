import { app } from 'electron';
import config from './config.js';
import { initMenu } from './menu.js';
import { showDefaultView } from './view.js';

app.whenReady()
  .then(() => config.init())
  .then(() => {
    initMenu();
    showDefaultView();
    app.on('activate', () => {
      showDefaultView();
    });
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

