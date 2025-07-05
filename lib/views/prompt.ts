import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export class PromptView {
  private view: BrowserWindow | null = null;

  cerateWindow(parent: BrowserWindow | null) {
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
    win.on('close', () => this.view = null);
    return win;
  }

  show(parent: BrowserWindow | null, options: Record<string, string> = {}): Promise<string> {
    if (!this.view) {
      this.view = this.cerateWindow(parent);
    }

    this.view.loadFile('ui/prompt.html', {
      query: options,
    });

    this.view.once('ready-to-show', () => {
      if (!this.view) {
        return;
      }
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
    if (this.view) {
      this.view.close();
      this.view = null;
    }
  }
}
