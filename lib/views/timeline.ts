import { BrowserWindow, clipboard } from 'electron';
import contextMenu from 'electron-context-menu';
import { screen } from 'electron/main';
import { defaultBounds, equalBounds } from '../bounds.js';
import config from '../config.js';
import { isXUrl, openWithExternalBrowser } from '../link.js';
import { getLogger } from '../log.js';
import { addSpamFilterToQuery, searchUrlList } from '../search.js';
import { isValidUserId } from '../user-id.js';

const log = getLogger();

const baseURL = 'https://x.com';

const customCSSRules = `
  @font-face {
    font-family: 'TsukushiARoundGothic';
    src: local('Tsukushi A Round Gothic Bold'), local('Tsukushi A Round Gothic');
    font-weight: bold;
  }
  @font-face {
    font-family: 'TsukushiARoundGothic';
    src: local('Tsukushi A Round Gothic Regular'), local('Tsukushi A Round Gothic');
    font-weight: normal;
  }
  .r-1tl8opc { font-family: 'TsukushiARoundGothic' !important }
  a[href="/jobs"] { display: none !important }
  a[href="/i/verified-orgs-signup"] { display: none !important }
  a[href="/i/premium_sign_up"] { display: none !important }
`;

export class TimelineView {
  #window: BrowserWindow | null = null;

  get window(): BrowserWindow | null {
    return this.#window;
  }

  #createWindow() {
    const bounds = config.get('windowBounds') ?? defaultBounds;
    const win = new BrowserWindow(bounds);
    this.setWindowEventHandlers(win);
    this.initContextMenu(win);
    return win;
  }

  setWindowEventHandlers(win: BrowserWindow) {
    win.on('close', () => this.saveWindowPosition());
    win.on('close', () => this.#window = null);

    win.webContents.setWindowOpenHandler((details) => {
      openWithExternalBrowser(details.url).catch(log.error);
      return { action: 'deny' };
    });
    win.webContents.on('will-navigate', (e, url) => {
      if (!isXUrl(url)) {
        e.preventDefault();
        openWithExternalBrowser(url).catch(log.error);
      }
    });
    win.webContents.on('did-finish-load', () => {
      this.#window?.webContents.insertCSS(customCSSRules);
    });
    win.webContents.on('before-input-event', (e, input) => {
      if (input.meta && input.type === 'keyDown' && input.key === 'ArrowLeft') {
        e.preventDefault();
        this.goBack();
      } else if (input.meta && input.type === 'keyDown' && input.key === 'ArrowRight') {
        e.preventDefault();
        this.goForward();
      }
    });
    win.webContents.session.webRequest.onBeforeRequest({ urls: searchUrlList }, (details, callback) => {
      const url = new URL(details.url);
      const newURL = addSpamFilterToQuery(url);
      if (newURL) {
        callback({ redirectURL: newURL.href });
      } else {
        callback({ cancel: false });
      }
    });
  }

  initContextMenu(win: BrowserWindow) {
    contextMenu({
      window: win,
      menu: (defaultActions, params, _browserWindow, dictionarySuggestions) => [
        dictionarySuggestions.length > 0 && defaultActions.separator(),
        ...dictionarySuggestions,
        defaultActions.separator(),
        defaultActions.learnSpelling({}),
        defaultActions.separator(),
        defaultActions.lookUpSelection({}),
        defaultActions.separator(),
        {
          label: 'Search in X',
          visible: params.selectionText && params.selectionText.length > 0 && params.selectionText.length < 128,
          click: () => {
            const word = encodeURIComponent(params.selectionText);
            const url = `/search?q=${word}&f=live`;
            this.loadXPage(url);
          },
        },
        defaultActions.searchWithGoogle({}),
        defaultActions.separator(),
        defaultActions.cut({}),
        defaultActions.copy({}),
        defaultActions.paste({}),
        // shouldShowSelectAll && defaultActions.selectAll(),
        defaultActions.separator(),
        {
          label: 'Copy image ID',
          visible: params.mediaType === 'image',
          click: () => {
            // URLの例 https://pbs.twimg.com/media/mediaID?format=jpg&name=orig
            // mediaIdはpath最後のスラッシュ以降の部分
            const mediaID = new URL(params.srcURL).pathname.split('/').at(-1);
            if (mediaID) {
              clipboard.writeText(mediaID);
            } else {
              log.warn(`Failed to extract media ID from URL: ${params.srcURL}`);
            }
          },
        },
        {
          label: 'Open image in external browser',
          visible: params.mediaType === 'image',
          click: () => {
            openWithExternalBrowser(params.srcURL).catch(log.error);
          },
        },
        {
          label: 'Open original in external browser',
          visible: params.mediaType === 'image',
          click: () => {
            const url = params.srcURL.replace(/&name=[a-z0-9]+$/, '&name=orig');
            openWithExternalBrowser(url).catch(log.error);
          },
        },
        // options.showSaveImage && defaultActions.saveImage(),
        // options.showSaveImageAs && defaultActions.saveImageAs(),
        // options.showCopyImage !== false && defaultActions.copyImage(),
        // options.showCopyImageAddress && defaultActions.copyImageAddress(),
        // options.showSaveVideo && defaultActions.saveVideo(),
        // options.showSaveVideoAs && defaultActions.saveVideoAs(),
        //options.showCopyVideoAddress && defaultActions.copyVideoAddress(),
        defaultActions.separator(),
        defaultActions.copyLink({}),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (defaultActions as any).saveLinkAs(), // .d.tsに設定が漏れているようだ。型エラー回避のため any を使う
        defaultActions.separator(),
        defaultActions.inspect(),
        defaultActions.services(),
        defaultActions.separator(),
      ],
    });
  }

  show() {
    if (!this.#window) {
      this.#window = this.#createWindow();
      this.#window.loadURL(`${baseURL}/`);
    }
  }

  loadXPage(url: string) {
    if (!this.#window) {
      this.#window = this.#createWindow();
    }
    this.#window.loadURL(`${baseURL}${url}`);
  }

  loadSearchPage(keyword: string) {
    this.loadXPage(`/search?q=${keyword}&f=live`);
  }

  loadUserPage(id: string) {
    const cleanedId = id.trim().replace(/^@/, '');
    if (!isValidUserId(cleanedId)) {
      return;
    }
    this.loadXPage(`/${cleanedId}`);
  }

  loadLogoutPage() {
    this.loadXPage('/logout');
  }

  loadInternalUrl(url: string) {
    const parsedUrl = new URL(url);
    if (!isXUrl(parsedUrl)) {
      return;
    }
    const internalUrl = `${parsedUrl.pathname}${parsedUrl.search}`;
    this.loadXPage(internalUrl);
  }

  goBack() {
    if (!this.#window) return;
    const { navigationHistory } = this.#window.webContents;
    if (!navigationHistory || !navigationHistory.canGoBack()) {
      return;
    }
    navigationHistory.goBack();
  }

  goForward() {
    if (!this.#window) return;
    const { navigationHistory } = this.#window.webContents;
    if (!navigationHistory || !navigationHistory.canGoForward()) {
      return;
    }
    navigationHistory.goForward();
  }

  saveWindowPosition() {
    if (!this.#window) {
      return;
    }
    const a = this.#window.getBounds();
    const b = config.get('windowBounds');
    if (!b || !equalBounds(a, b)) {
      config.setAndSave('windowBounds', a);
    }
  }

  resetWindowSize() {
    if (!this.#window) {
      return;
    }
    const desktopSize = screen.getPrimaryDisplay().size;
    const bounds = {
      y: 0,
      x: 0,
      width: 480,
      height: desktopSize.height,
    };
    if (desktopSize.width > 1470) {
      bounds.width = 690;
    }
    if (desktopSize.width > 1024) {
      bounds.x = desktopSize.width - bounds.width;
    }
    this.#window.setBounds(bounds);
  }
}
