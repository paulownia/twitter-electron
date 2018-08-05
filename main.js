'use strict';

const {app, shell, BrowserWindow} = require('electron');

const config = require('./lib/config');

let win = null;

app.on('ready', () => {
    config.init();
    createWindow();
});

app.on('window-all-closed', () => {
    app.quit();
});

/*
app.on('activate', () => {
    createWindow();
});
*/

function createWindow() {
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
