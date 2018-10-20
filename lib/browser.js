'use strict';

const { BrowserWindow, shell } = require('electron');
const config = require('./config');
const event = require('./event');

let win = null;

function init() {
    if (win !== null) {
        return;
    }

    var bound = config.get('windowBounds', { width: 480, height: 800, x: 50, y: 60 });

    win = new BrowserWindow(bound);

    win.loadURL('https://mobile.twitter.com/');

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

function saveWindowPosition() {
    const bound = win.getBounds();
    config.set('windowBounds', bound);
    config.save();
}

event.on('select-home', () => {
    if (!win) {
        init();
    }
    win.loadURL('https://mobile.twitter.com/');
});
event.on('select-forward', () => {
    if (win && win.webContents.canGoForward()) win.webContents.goForward();
});
event.on('select-back', () => {
    if (win && win.webContents.canGoBack()) win.webContents.goBack();
});
