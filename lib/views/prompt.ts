import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export class PromptView {
  #window: BrowserWindow | null = null;

  #cerateWindow(parent: BrowserWindow | null) {
    const win = new BrowserWindow({
      parent: parent || undefined,
      width: parent ? parent.getSize()[0] - 16 : 480,
      height: 180,
      show: false,
      resizable: false,
      center: true,
      modal: !!parent,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(app.getAppPath(), 'preload/prompt.js'),
      },
    });
    win.on('close', () => this.#window = null);
    return win;
  }

  show(parent: BrowserWindow | null, options: Record<string, string> = {}): Promise<string> {
    if (!this.#window) {
      this.#window = this.#cerateWindow(parent);
    }

    this.#window.loadFile('ui/prompt.html', {
      query: options,
    });

    this.#window.once('ready-to-show', () => {
      if (!this.#window) {
        return;
      }
      this.#window.show();
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
    if (this.#window) {
      this.#window.close();
      this.#window = null;
    }
  }
}
