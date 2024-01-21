const { BrowserWindow, clipboard, ipcMain } = require('electron');
const path = require('path');

const link = require('../link');

class OpenURLView {
  init(parent) {
    this.view = new BrowserWindow({
      parent: parent,
      toolbar: false,
      width: parent ? parent.getSize()[0] - 16 : 480,
      height: 180,
      show: false,
      resizable: false,
      center: true,
      modal: parent ? true : false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'preload', 'open-url.js'),
      },
    });
    this.view.on('close', () => this.view = null);
  }

  getDefaultURL() {
    const text = clipboard.readText();
    if (link.isTwitter(text)) {
      return text;
    } else {
      return '';
    }
  }

  prompt(parent) {
    if (!this.view) {
      this.init(parent);
    }

    this.view.loadFile('ui/open-url.html', {
      query: {
        value: this.getDefaultURL(),
      }
    });

    this.view.once('ready-to-show', () => {
      this.view.show();
    });

    return new Promise((resolve, reject) => {
      ipcMain.handleOnce('open-url', (event, ...[url]) => {
        if (url && link.isTwitter(url)) {
          resolve(url);
        } else {
          reject();
        }
        this.close();
      });
    });
  }

  close() {
    ipcMain.removeHandler('open-url');
    this.view.close();
    this.view = null;
  }
}

exports.OpenURLView = OpenURLView;
