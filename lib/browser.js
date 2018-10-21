'use strict';

const { BrowserWindow, shell } = require('electron');
const config = require('./config');
const event = require('./event');

const path = require('path');
const url = require('url');

let win = null;
let searchPanel = null;

function init() {
    if (win !== null) {
        return;
    }

    var bound = config.get('windowBounds', { width: 480, height: 800, x: 50, y: 60 });

    win = new BrowserWindow(bound);

    win.on('move', saveWindowPosition);
    win.on('resize', saveWindowPosition);

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
}

exports.init = init;

function loadHome() {
    if (win) win.loadURL('https://mobile.twitter.com/');
}

exports.loadHome = loadHome;

function saveWindowPosition() {
    const bound = win.getBounds();
    config.set('windowBounds', bound);
    config.save();
}

event.on('select-home', () => {
    if (!win) {
        init();
    }
    loadHome();
});
event.on('select-forward', () => {
    if (win && win.webContents.canGoForward()) win.webContents.goForward();
});
event.on('select-back', () => {
    if (win && win.webContents.canGoBack()) win.webContents.goBack();
});
event.on('search', ({encoded}) => {
    if (!win) {
        init();
    }
    win.loadURL('https://mobile.twitter.com/search?q=' + encoded);
});
event.on('select-find', () => {
    searchPanel = new BrowserWindow({
        parent: win,
        frame: false,
        width: 240,
        height: 48,
    });
    searchPanel.loadURL(url.format({
        protocol: 'file:',
        pathname: path.join(__dirname, '..',  'search.html')
    }));
    searchPanel.on('closed', () => {
        searchPanel = null;
    });
});
