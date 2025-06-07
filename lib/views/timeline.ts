import { BrowserWindow, clipboard } from 'electron';
import contextMenu from 'electron-context-menu';
import { screen } from 'electron/main';
import { config } from '../config.js';
import { isTwitterURL, openWithExternalBrowser } from '../link.js';
import { log } from '../log.js';
import { isValidUserId } from '../user-id.js';

const baseURL = 'https://x.com';

const searchURLs = [
  'https://x.com/i/api/graphql/*/SearchTimeline?*',
  'https://x.com/search?*',
  'https://twitter.com/i/api/graphql/*/SearchTimeline?*',
  'https://twitter.com/search?*',
];

const customCSSRules = `
  .r-1tl8opc { font-family:'Tsukushi A Round Gothic', '筑紫A丸ゴシック' !important }
  a[href="/jobs"] { display: none !important }
  a[href="/i/verified-orgs-signup"] { display: none !important }
  a[href="/i/premium_sign_up"] { display: none !important }
`;

/**
 * 指定したURLオブジェクトの検索クエリに、スパム（インプレゾンビ）避けのキーワードを追加する
 * @param {URL} url
 * @returns {URL|null} フィルタが追加された新しいURLオブジェクト、追加する必要がない（＝検索URLではない、既に追加されている）場合はnull
 */
function addSpamFilterToQuery(url: URL): URL | null {
  if (url.pathname.startsWith('/i/api/graphql/')) {
    return addSpamFilterToQueryForSearchApi(url);
  } else if (url.pathname.startsWith('/search')) {
    return addSpamFilterToQueryForSearchWeb(url);
  } else {
    return null;
  }
}

/**
 *
 * @param {URL} url
 * @returns {URL|null}
 */
function addSpamFilterToQueryForSearchApi(url: URL): URL | null {
  const rawParamVariables = url.searchParams.get('variables');
  if (!rawParamVariables) return null;
  const paramVariables = decodeURIComponent(rawParamVariables);

  const variables = JSON.parse(paramVariables);
  const rawQuery = variables.rawQuery;
  if (!rawQuery) {
    return null;
  }
  if (rawQuery.includes('-source:Twitter_for_Advertisers')) {
    return null;
  }
  variables.rawQuery = rawQuery + ' -source:Twitter_for_Advertisers';
  const newParamVariables = JSON.stringify(variables);  // encodeURIComponent は不要、URLSearchParams がやってくれる

  log.info(`rewrite graphql query, variables=${newParamVariables}`);

  const newUrl = new URL(url.toString());
  newUrl.searchParams.set('variables', newParamVariables);
  return newUrl;
}

/**
 *
 * @param {URL} url
 * @returns {URL|null}
 */
function addSpamFilterToQueryForSearchWeb(url: URL): URL | null {
  const q = url.searchParams.get('q');
  if (!q) {
    return null;
  }
  if (q.includes('-source:Twitter_for_Advertisers')) {
    return null;
  }
  const newQ = q + ' -source:Twitter_for_Advertisers';

  log.info(`rewrite search query, q=${newQ}`);

  const newUrl = new URL(url.toString());
  newUrl.searchParams.set('q', newQ);
  return newUrl;
}

export class TimelineView {
  private view: BrowserWindow | null = null;
  public getView(): BrowserWindow | null {
    return this.view;
  }

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
      return { action: 'deny' };
    });
    this.view.webContents.on('will-navigate', (e, url) => {
      if (!isTwitterURL(url)) {
        e.preventDefault();
        openWithExternalBrowser(url).catch(log.error);
      }
    });
    this.view.webContents.on('did-finish-load', () => {
      this.view!.webContents.insertCSS(customCSSRules);
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
    this.view.webContents.session.webRequest.onBeforeRequest({ urls: searchURLs }, (details, callback) => {
      const url = new URL(details.url);
      const newURL = addSpamFilterToQuery(url);
      if (newURL) {
        callback({ redirectURL: newURL.href });
      } else {
        callback({ cancel: false });
      }
    });
    this.initContextMenu();
  }

  initContextMenu() {
    contextMenu({
      window: this.view ?? undefined,
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
    if (!this.view) {
      this.init();
      this.view!.loadURL(`${baseURL}/`);
    }
  }

  loadRawURL(url: string) {
    if (isTwitterURL(url)) {
      this.view!.loadURL(url);
    }
  }


  loadXPage(url: string) {
    if (!this.view) {
      this.init();
    }
    this.view!.loadURL(`${baseURL}${url}`);
  }

  loadSearchPage(keyword: string) {
    this.loadXPage(`/search?q=${keyword}&f=live`);
  }

  loadUserPage(id: string) {
    if (!isValidUserId(id)) {
      return;
    }
    this.loadXPage(`/${id}`);
  }

  loadLogoutPage() {
    this.loadXPage('/logout');
  }

  goBack() {
    if (!this.view) return;
    const { navigationHistory } = this.view.webContents;
    if (!navigationHistory || !navigationHistory.canGoBack()) {
      return;
    }
    navigationHistory.goBack();
  }

  goForward() {
    if (!this.view) return;
    const { navigationHistory } = this.view.webContents;
    if (!navigationHistory || !navigationHistory.canGoForward()) {
      return;
    }
    navigationHistory.goForward();
  }

  saveWindowPosition() {
    if (!this.view) {
      return;
    }
    const a = this.view.getBounds();
    const b = config.get('windowBounds') as { x: number, y: number, width: number, height: number } | undefined;
    if (!b || a.x !== b.x || a.y !== b.y || a.width !== b.width || a.height !== b.height) {
      config.set('windowBounds', a);
      config.persist();
    }
  }

  resetWindowSize() {
    if (!this.view) {
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
    this.view.setBounds(bounds);
  }

  /**
   * 検索実行
   * @param keyword 検索キーワード
   * @param type 検索タイプ
   */
  search(keyword: string, type: string) {
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

