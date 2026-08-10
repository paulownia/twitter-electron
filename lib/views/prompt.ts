import { app, BrowserWindow, WebContents } from 'electron';
import path from 'path';

// Must be subset of Record<string, string> because of the way query parameters are passed to loadFile.
// `interface` is not subset of Record<string, string> so we have to use `type`.
export type PromptOptions = {
  title: string;
  placeholder: string;
  okLabel: string;
  defaultValue?: string;
  promptType?: 'text' | 'url';
  selected?: 'true' | 'false';
};

export type PromptKind = 'find-topics' | 'user-id' | 'open-url';

export class PromptView {
  #window: BrowserWindow;
  #options: PromptOptions;
  #kind: PromptKind;

  get window(): BrowserWindow {
    return this.#window;
  }

  get kind(): PromptKind {
    return this.#kind;
  }

  constructor(parent: BrowserWindow | null, options: PromptOptions, kind: PromptKind) {
    this.#window = new BrowserWindow({
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
    this.#options = options;
    this.#kind = kind;
  }

  show() {
    if (this.#window.isDestroyed()) return;
    this.#window.loadFile('ui/prompt.html', { query: this.#options }).then(() => {
      this.#window.show();
    });
  }

  isSender(sender: WebContents): boolean {
    return this.#window?.webContents === sender;
  }

  close(): void {
    this.#window.close();
  }

  onClosed(callback: () => void): void {
    this.#window.once('closed', callback);
  }
}
