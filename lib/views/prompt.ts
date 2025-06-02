import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { log } from '../log.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class PromptView {
  private view: BrowserWindow | null = null;

  init(parent: BrowserWindow | null) {
    log.info(`__dirname=${__dirname}`);
    log.info(`__filename=${__filename}`)

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
        preload: path.join(__dirname, '..', 'preload', 'prompt.js'),
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
