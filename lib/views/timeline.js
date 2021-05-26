const { BrowserWindow } = require('electron');
const config = require('../config');
const link = require('../link');

class TimelineView {
  init() {
    if (this.view) {
      return;
    }

    const bound = config.get('windowBounds') ?? { width: 480, height: 800, x: 50, y: 60 };
    this.view = new BrowserWindow(bound);

    this.view.on('close', () => this.saveWindowPosition());
    this.view.on('close', () => this.view = null);

    this.view.webContents.on('new-window', (e, url) => {
      e.preventDefault();
      link.openWithExternalBrowser(url);
    });
    this.view.webContents.on('will-navigate', (e, url) => {
      if (!link.isTwitter(url)) {
        e.preventDefault();
        link.openWithExternalBrowser(url);
      }
    });
    this.view.webContents.on('did-finish-load', () => {
      this.view.webContents.insertCSS('.r-1tl8opc { font-family:\'Tsukushi A Round Gothic\', \'筑紫A丸ゴシック\' !important }');
    });
    this.view.webContents.on('before-input-event', (e, input) => {
      if (input.meta && input.type === 'keyDown' && input.key === 'ArrowLeft') {
        e.preventDefault();
        this.goBack();
      } else if (input.meta && input.type === 'keyDown' && input.key === 'ArrowRight') {
        e.preventDefault();
        this.goForward();
      }
    });
  }

  show() {
    if (this.isUnloaded()) {
      this.init();
      this.view.loadURL('https://twitter.com/');
    }
  }

  loadHomePage() {
    if (this.isUnloaded()) {
      this.init();
    }
    this.view.loadURL('https://twitter.com/');
  }

  loadSearchPage(keyword) {
    if (this.isUnloaded()) {
      this.init();
    }
    this.view.loadURL(`https://twitter.com/search?q=${keyword}&f=live`);
  }

  loadLogoutPage() {
    if (this.isUnloaded()) {
      this.init();
    }
    this.view.loadURL('https://twitter.com/logout');
  }

  isUnloaded() {
    return !this.view;
  }

  goBack() {
    if (!this.view) return;
    ($ => $.canGoBack() && $.goBack())(this.view.webContents);
  }

  goForward() {
    if (!this.view) return;
    ($ => $.canGoForward() && $.goForward())(this.view.webContents);
  }

  saveWindowPosition() {
    const a = this.view.getBounds();
    const b = config.get('windowBounds');
    if (!b || a.x !== b.x || a.y !== b.y || a.width !== b.width || a.height !== b.height) {
      config.set('windowBounds', a);
      config.save();
    }
  }
}

exports.TimelineView = TimelineView;

