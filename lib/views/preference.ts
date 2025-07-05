import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import config from '../config.js';

export class PreferenceView {
  private view: BrowserWindow | null = null;

  createWindow() {
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
      this.view = null;
      ipcMain.removeHandler('get-cache-size');
      ipcMain.removeHandler('clear-cache');
    });

    ipcMain.handle('get-cache-size', async () => {
      if (!this.view) {
        return 0; // or throw an error if you prefer
      }
      return await this.view.webContents.session.getCacheSize();
    });

    ipcMain.handle('clear-cache', async () => {
      if (!this.view) {
        return; // or throw an error if you prefer
      }
      await this.view.webContents.session.clearCache();
    });

    return win;
  }

  show() {
    if (!this.view) {
      this.view = this.createWindow();
    }
    // this.view.webContents.openDevTools();
    this.view.loadFile('ui/preference.html');
    this.view.show();
  }
}

ipcMain.handle('set-preference', (_event, key: string, value: unknown) => {
  if (key !== 'externalBrowser' || typeof value !== 'string') {
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
