import { BrowserWindow, ipcMain, app } from 'electron';
import path from 'path';
import { config } from '../config.js';

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

ipcMain.handle('set-preference', (_event, key: string, value: unknown) => {
  if (key === 'externalBrowser' && typeof value === 'string') {
    config.set('externalBrowser', value);
    config.persist();
    return;
  }
  throw new Error(`Unsupported key for config setter: ${key}`);
});

ipcMain.handle('get-preference', (_event, key: string) => {
  if (key === 'externalBrowser') {
    return config.get(key);
  }
  throw new Error(`Unsupported key for config getter: ${key}`);
});
