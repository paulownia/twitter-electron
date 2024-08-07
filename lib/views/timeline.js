import { BrowserWindow } from 'electron';
import contextMenu from 'electron-context-menu';
import { config } from '../config.js';
import { isTwitterURL, openWithExternalBrowser } from '../link.js';
import { log } from '../log.js';


// twitter idとして使えない文字列、特殊なページのpathとなっているもの
const invalidIds = new Set(['login', 'logout', 'search', 'home', 'notifications', 'messages', 'i', 'settings', 'account', 'explore', 'about', 'help', 'tos', 'privacy', 'jobs', 'download']);

const baseURL = 'https://twitter.com';

export class TimelineView {
  init() {
    if (this.view) {
      return;
    }

    const bound = config.get('windowBounds') ?? { width: 480, height: 800, x: 50, y: 60 };
    this.view = new BrowserWindow(bound);

    this.view.on('close', () => this.saveWindowPosition());
    this.view.on('close', () => this.view = null);

    this.view.webContents.setWindowOpenHandler((details) => {
      openWithExternalBrowser(details.url).catch(log.error);
      return {action: 'deny'};
    });
    this.view.webContents.on('will-navigate', (e, url) => {
      if (!isTwitterURL(url)) {
        e.preventDefault();
        openWithExternalBrowser(url).catch(log.error);
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

    this.initContextMenu();
  }

  initContextMenu() {
    contextMenu({
      window: this.view,
      menu: (defaultActions, params, _browserWindow, dictionarySuggestions) => [
        dictionarySuggestions.length > 0 && defaultActions.separator(),
        ...dictionarySuggestions,
        defaultActions.separator(),
        defaultActions.learnSpelling(),
        defaultActions.separator(),
        defaultActions.lookUpSelection(),
        defaultActions.separator(),
        {
          label: 'Search in X',
          visible: params.selectionText && params.selectionText.length > 0 && params.selectionText.length < 128,
          click: () => {
            const word = encodeURIComponent(params.selectionText);
            const url = `/search?q=${word}&f=live`;
            this.loadXPage(url);
          }
        },
        defaultActions.searchWithGoogle(),
        defaultActions.separator(),
        defaultActions.cut(),
        defaultActions.copy(),
        defaultActions.paste(),
        // shouldShowSelectAll && defaultActions.selectAll(),
        defaultActions.separator(),
        {
          label: 'Open image in external browser',
          visible: params.mediaType === 'image',
          click: () => {
            openWithExternalBrowser(params.srcURL).catch(log.error);
          }
        },
        {
          label: 'Open original in external browser',
          visible: params.mediaType === 'image',
          click: () => {
            const url = params.srcURL.replace(/&name=[a-z0-9]+$/, '&name=orig');
            openWithExternalBrowser(url).catch(log.error);
          }
        },
        // options.showSaveImage && defaultActions.saveImage(),
        // options.showSaveImageAs && defaultActions.saveImageAs(),
        // options.showCopyImage !== false && defaultActions.copyImage(),
        // options.showCopyImageAddress && defaultActions.copyImageAddress(),
        // options.showSaveVideo && defaultActions.saveVideo(),
        // options.showSaveVideoAs && defaultActions.saveVideoAs(),
        //options.showCopyVideoAddress && defaultActions.copyVideoAddress(),
        defaultActions.separator(),
        defaultActions.copyLink(),
        defaultActions.saveLinkAs(),
        defaultActions.separator(),
        defaultActions.inspect(),
        defaultActions.services(),
        defaultActions.separator()
      ]
    });
  }

  show() {
    if (!this.view) {
      this.init();
      this.view.loadURL(`${baseURL}/`);
    }
  }

  loadRawURL(url) {
    if (isTwitterURL(url)) {
      this.view.loadURL(url);
    }
  }


  loadXPage(url) {
    if (!this.view) {
      this.init();
    }
    this.view.loadURL(`${baseURL}${url}`);
  }

  loadSearchPage(keyword) {
    this.loadXPage(`/search?q=${keyword}&f=live`);
  }

  loadUserPage(id) {
    if (invalidIds.has(id)) {
      return;
    }
    if (id.length < 3) { // 3文字以下のidは存在しない（はず）
      return;
    }
    if (!id.match(/^[\w_]+$/)) { // 英数字とアンダースコア以外の文字が含まれている
      return;
    }
    this.loadXPage(`/${id}`);
  }

  loadLogoutPage() {
    this.loadXPage('/logout');
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
      config.persist();
    }
  }

  /**
   * 検索実行
   * @param keyword 検索キーワード
   * @param type 検索タイプ
   */
  search(keyword, type) {
    switch (type) {
    case 'findTopics':
      this.loadSearchPage(keyword);
      break;
    case 'jumpUserPage':
      this.loadUserPage(keyword);
      break;
    }
  }
}
