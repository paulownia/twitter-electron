import { app, BrowserWindow } from 'electron';
import path from 'path';

export class PreferenceView {
  #window: BrowserWindow;

  constructor() {
    this.#window = new BrowserWindow({
      width: 480,
      height: 640,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(app.getAppPath(), 'preload/preference.js'),
      },
    });
  }

  show() {
    this.#window.loadFile('ui/preference.html').then(() => {
      this.#window.show();
    });
  }
}