const { BrowserWindow } = require('electron');
const path = require('path');
const { ipcMain } = require('electron');
const config = require('../config');

// このviewで対応している設定項目
const configKey = {
  externalBrowser: 'externalBrowser',
};

class PreferenceView {
  init() {
    this.view = new BrowserWindow({
      toolbar: false,
      width: 480,
      height: 640,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'preload', 'preference.js'),
      }
    });
    this.view.on('closed', () => this.view = null);
  }

  show() {
    if (!this.view) {
      this.init();
    }
    // this.view.webContents.openDevTools();
    this.view.loadFile('ui/preference.html');
    this.view.show();
  }
}

exports.PreferenceView = PreferenceView;

ipcMain.handle('set-preference', (_event, key, value) => {
  if (!configKey[key]) {
    throw new Error(`Unsupported key: ${key}`);
  }
  if (config.get(key) === value) {
    return;
  }
  config.set(key, value);
  config.save();
});

ipcMain.handle('get-preference', (_event, key) => {
  if (!configKey[key]) {
    throw new Error(`Unsupported key: ${key}`);
  }

  return config.get(key);
});
