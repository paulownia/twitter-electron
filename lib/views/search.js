const { BrowserWindow } = require('electron');
const path = require('path');

class SearchView {
  init(parent) {
    this.view = new BrowserWindow({
      parent: parent,
      frame: false,
      transparent: true,
      toolbar: false,
      width: 480,
      height: 32,
      show: true,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, '..', 'preload', 'search.js'),
      }
    });
    this.view.on('close', () => this.view = null);
    this.view.on('blur', () => this.close());
  }

  show(parent, option) {
    if (!this.view) {
      this.init(parent);
    }
    // this.view.webContents.openDevTools();
    this.view.loadFile('ui/search.html');
    this.view.show();
    this._searchType = option.type;
  }

  get searchType() {
    return this._searchType;
  }

  close() {
    this.view.close();
  }
}

exports.SearchView = SearchView;
