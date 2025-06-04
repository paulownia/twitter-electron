import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export class PromptView {
  private view: BrowserWindow | null = null;

  init(parent: BrowserWindow | null) {
    this.view = new BrowserWindow({
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
    this.view.on('close', () => this.view = null);
  }

  show(parent: BrowserWindow | null, options: Record<string, string> = {}): Promise<string> {
    if (!this.view) {
      this.init(parent);
    }

    this.view!.loadFile('ui/prompt.html', {
      query: options,
    });

    this.view!.once('ready-to-show', () => {
      this.view!.show();
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
    this.view?.close();
    this.view = null;
  }
}
