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

    win.on('close', () => {
        const bound = win.getBounds();
        config.set('windowBounds', bound);
        config.save();
    });

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on('new-window', function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
}

exports.init = init;

event.on('select-reset', () => {
    if (!win) {
        init();
    }
    win.loadURL('https://mobile.twitter.com/');
});
