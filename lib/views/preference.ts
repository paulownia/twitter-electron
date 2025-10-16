import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { isValidBrowser } from '../browser.js';
import config from '../config.js';

export class PreferenceView {
  #window: BrowserWindow | null = null;

  #createWindow() {
    const win = new BrowserWindow({
      width: 480,
      height: 640,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(app.getAppPath(), 'preload/preference.js'),
      },
    });
    win.on('closed', () => {
      this.#window = null;
      ipcMain.removeHandler('get-cache-size');
      ipcMain.removeHandler('clear-cache');
    });

    ipcMain.handle('get-cache-size', async () => {
      if (!this.#window) {
        return 0; // or throw an error if you prefer
      }
      return await this.#window.webContents.session.getCacheSize();
    });

    ipcMain.handle('clear-cache', async () => {
      if (!this.#window) {
        return; // or throw an error if you prefer
      }
      await this.#window.webContents.session.clearCache();
    });

    return win;
  }

  show() {
    if (!this.#window) {
      this.#window = this.#createWindow();
    }
    // this.#view.webContents.openDevTools();
    this.#window.loadFile('ui/preference.html');
    this.#window.show();
  }
}

ipcMain.handle('set-preference', (_event, key: string, value: unknown) => {
  if (key !== 'externalBrowser' || typeof value !== 'string' || isValidBrowser(value) === false) {
    throw new Error(`Unsupported key for config setter: ${key}`);
  }
  config.setAndSave('externalBrowser', value);
});

ipcMain.handle('get-preference', (_event, key: string) => {
  if (key === 'externalBrowser') {
    return config.get(key);
  }
  throw new Error(`Unsupported key for config getter: ${key}`);
});
