const { BrowserWindow } = require('electron');
const path = require('path');

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
        preload: path.join(__dirname, '..', '..', '/preload.js')
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
