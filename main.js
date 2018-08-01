'use strict';

const {app, shell, BrowserWindow} = require('electron');


let win = null;

app.on('ready', () => {
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

    win = new BrowserWindow({ width: 480, height: 800 });

    win.loadURL('https://mobile.twitter.com/');

    win.on('closed', () => {
        win = null;
    });

    win.webContents.on("new-window", function(e, url) {
        e.preventDefault();
        shell.openExternal(url);
    });
}
