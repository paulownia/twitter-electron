'use strict';

const { BrowserWindow, shell } = require('electron');
const config = require('./config');
const event = require('./event');

const path = require('path');
const url = require('url');

let mainPanel = null;
let searchPanel = null;

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
    shell.openExternal(url);
  });

  mainPanel.webContents.on('did-finish-load', () => {
    mainPanel.webContents.insertCSS('.r-gwet1z { font-family:\'Tsukushi A Round Gothic\', \'筑紫A丸ゴシック\' !important }');
  });

  searchPanel = new BrowserWindow({
    parent: mainPanel,
    frame: false,
    transparent: true,
    toolbar: false,
    width: 480,
    height: 32,
    show: false
  });
  searchPanel.loadURL(url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, '..',  'search.html')
  }));

  if (loadingHome) {
    loadHome();
  }
}

exports.init = init;

function loadHome() {
  if (mainPanel) mainPanel.loadURL('https://twitter.com/');
}

exports.loadHome = loadHome;

function saveWindowPosition() {
  const bound = mainPanel.getBounds();
  config.set('windowBounds', bound);
  config.save();
}

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
event.on('search', ({encoded}) => {
  if (!mainPanel) {
    init();
  }
  mainPanel.loadURL('https://twitter.com/search?q=' + encoded + '&f=live');
});
event.on('select-find', () => {
  if (searchPanel) searchPanel.show();
});
event.on('search-end', () => {
  if (searchPanel) searchPanel.hide();
});
event.on('select-logout', () => {
  mainPanel.loadURL('https://twitter.com/logout');
});
