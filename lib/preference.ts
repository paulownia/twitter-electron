import { ipcMain } from 'electron';
import { Browser, isValidBrowser } from './browser.js';
import config from './config.js';

export function initPreference() {
  ipcMain.handle('get-cache-size', (event) => getCacheSize(event.sender));
  ipcMain.handle('clear-cache', (event) => clearCache(event.sender));
  ipcMain.handle('set-preference', (_event, key: string, value: unknown) => setPreference(key, value));
  ipcMain.handle('get-preference', (_event, key: string) => getPreference(key));
}

function getCacheSize(webContents: Electron.WebContents): Promise<number> {
  return webContents.session.getCacheSize();
}

function clearCache(webContents: Electron.WebContents): Promise<void> {
  return webContents.session.clearCache();
}

function setPreference(key: string, value: unknown): void {
  if (key === 'externalBrowser' && isValidBrowser(value)) {
    return void config.setAndSave('externalBrowser', value);
  }
  throw new Error(`Unsupported key or value for config setter: ${key}, ${value}`);
}

function getPreference(key: string): Browser | undefined {
  if (key === 'externalBrowser') {
    return config.get(key);
  }
  throw new Error(`Unsupported key for config getter: ${key}`);
}
