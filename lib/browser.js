'use strict';

const { PreferenceView } = require('./views/preference');

const { BrowserWindow } = require('electron');
const config = require('./config');
const event = require('./event');

const path = require('path');
const open = require('open');

let mainPanel = null;
let searchPanel = null;

const preferenceView = new PreferenceView();

function init(loadingHome = false) {
  if (mainPanel !== null) {
    return;
  }

  let bound = config.get('windowBounds', { width: 480, height: 800, x: 50, y: 60 });

  mainPanel = new BrowserWindow(bound);

  mainPanel.on('move', saveWindowPosition);
  mainPanel.on('resize', saveWindowPosition);

  mainPanel.on('closed', () => {
    mainPanel = null;
    searchPanel = null;
  });

  mainPanel.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    open(url, {app: {name: 'firefox'}});
    //shell.openExternal(url);
  });

  mainPanel.webContents.on('did-finish-load', () => {
    mainPanel.webContents.insertCSS('.r-1tl8opc { font-family:\'Tsukushi A Round Gothic\', \'筑紫A丸ゴシック\' !important }');
  });

  mainPanel.webContents.on('before-input-event', (inputEvent, input) => {
    if (!mainPanel) {
      return;
    }

    if (input.meta && input.type === 'keyDown' && input.key === 'ArrowLeft') {
      mainPanel.webContents.canGoBack() && mainPanel.webContents.goBack();
      inputEvent.preventDefault();
    } else if (input.meta && input.type === 'keyDown' && input.key === 'ArrowRight') {
      mainPanel.webContents.canGoForward() && mainPanel.webContents.goForward();
      inputEvent.preventDefault();
    }
  });

  if (loadingHome) {
    loadHome();
  }
}

exports.init = init;

function loadHome() {
  if (mainPanel) mainPanel.loadURL('https://twitter.com/');
}

function saveWindowPosition() {
  const bound = mainPanel.getBounds();
  config.set('windowBounds', bound);
  config.save();
}

function initSearchPanel() {
  searchPanel = new BrowserWindow({
    parent: mainPanel,
    frame: false,
    transparent: true,
    toolbar: false,
    width: 480,
    height: 32,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '..', '/preload.js')
    }
  });
  searchPanel.loadFile('search.html');
  // searchPanel.webContents.openDevTools();
}


exports.search = (keyword) => {
  if (!mainPanel) {
    init();
  }
  mainPanel.loadURL(`https://twitter.com/search?q=${keyword}&f=live`);

};

exports.searchEnd = () => {
  if (searchPanel) {
    searchPanel.close();
    searchPanel = null;
  }
};

event.on('select-home', () => {
  if (!mainPanel) {
    init();
  }
  loadHome();
});
event.on('select-forward', () => {
  if (mainPanel && mainPanel.webContents.canGoForward()) mainPanel.webContents.goForward();
});
event.on('select-back', () => {
  if (mainPanel && mainPanel.webContents.canGoBack()) mainPanel.webContents.goBack();
});
event.on('select-find', () => {
  if (!searchPanel) {
    initSearchPanel();
  }
  searchPanel.show();
});
event.on('select-logout', () => {
  mainPanel.loadURL('https://twitter.com/logout');
});
event.on('select-preferences', () => {
  preferenceView.show();
});
