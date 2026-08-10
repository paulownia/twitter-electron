import { app } from 'electron';
import { initConfig } from './config.js';
import { initLogger } from './log.js';
import { initMenu } from './menu.js';
import { initPreference } from './preference.js';
import { initPrompt } from './prompt.js';
import { showDefaultView } from './view.js';

app.commandLine.appendSwitch('disk-cache-size', String(512 * 1024 * 1024));

app.whenReady()
  .then(() => initLogger(app))
  .then(() => initConfig())
  .then(() => {
    initPrompt();
    initPreference();
    initMenu();
    showDefaultView();
    app.on('activate', () => {
      showDefaultView();
    });
  });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
