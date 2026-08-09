import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { PromptRequest } from '../prompt-request.js';

export class PromptView {
  #window: BrowserWindow | null = null;
  #request = new PromptRequest();

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
    win.on('closed', () => {
      if (this.#window !== win) return;
      this.#window = null;
      ipcMain.removeHandler('prompt-complete');
      this.#request.cancel();
    });
    return win;
  }

  show(parent: BrowserWindow | null, options: Record<string, string> = {}): Promise<string> {
    // 表示内容と完了処理が食い違わないよう、既存のプロンプト要求を先に終了する。
    this.close();
    const win = this.#cerateWindow(parent);
    this.#window = win;

    win.once('ready-to-show', () => {
      // 遅れて発火した古いウィンドウのイベントで、新しいプロンプトを表示しない。
      if (this.#window !== win || win.isDestroyed()) return;
      win.show();
    });

    void win.loadFile('ui/prompt.html', {
      query: options,
    });

    const result = this.#request.start();
    ipcMain.handleOnce('prompt-complete', (_event, value, button) => {
      this.#request.complete(value, button);
      this.close();
    });
    return result;
  }

  close() {
    ipcMain.removeHandler('prompt-complete');
    this.#request.cancel();
    if (this.#window) {
      const win = this.#window;
      this.#window = null;
      win.close();
    }
  }
}
