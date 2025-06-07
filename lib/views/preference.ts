import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import { config } from '../config.js';

const configKeys = ['externalBrowser'] as const;
type ConfigKey = typeof configKeys[number];

function isValidConfigKey(key: string): key is ConfigKey {
  return configKeys.includes(key as ConfigKey);
}

export class PreferenceView {
  private view: BrowserWindow | null = null;

  init() {
    this.view = new BrowserWindow({
      width: 480,
      height: 640,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(app.getAppPath(), 'preload/preference.js'),
      },
    });
    this.view.on('closed', () => {
      this.view = null;
      ipcMain.removeHandler('get-cache-size');
      ipcMain.removeHandler('clear-cache');
    });

    ipcMain.handle('get-cache-size', async () => {
      return await this.view!.webContents.session.getCacheSize();
    });

    ipcMain.handle('clear-cache', async () => {
      await this.view!.webContents.session.clearCache();
    });
  }

  show() {
    if (!this.view) {
      this.init();
    }
    // this.view.webContents.openDevTools();
    this.view!.loadFile('ui/preference.html');
    this.view!.show();
  }
}

ipcMain.handle('set-preference', (_event, key: string, value: any) => {
  if (!isValidConfigKey(key)) {
    throw new Error(`Unsupported key: ${key}`);
  }
  if (config.get(key) === value) {
    return;
  }
  config.set(key, value);
  config.persist();
});

ipcMain.handle('get-preference', (_event, key: string) => {
  if (!isValidConfigKey(key)) {
    throw new Error(`Unsupported key: ${key}`);
  }

  return config.get(key);
});
