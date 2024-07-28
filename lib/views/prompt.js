import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

export class PromptView {
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
        preload: path.join(__dirname, '..', 'preload', 'prompt.js'),
      },
    });
    this.view.on('close', () => this.view = null);
  }

  show(parent, options = {}) {
    if (!this.view) {
      this.init(parent);
    }

    this.view.loadFile('ui/prompt.html', {
      query: options,
    });

    this.view.once('ready-to-show', () => {
      this.view.show();
    });

    return new Promise((resolve, reject) => {
      ipcMain.handleOnce('prompt-complete', (_event, ...[value, button]) => {
        if (button === 'cancel' || value === '' || value === null || value === undefined) {
          reject();
        } else {
          resolve(value);
        }
        this.close();
      });
    });
  }

  close() {
    ipcMain.removeHandler('prompt-complete');
    this.view.close();
    this.view = null;
  }
}
