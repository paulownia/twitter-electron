'use strict';

const { app } = require('electron');

const config = require('./lib/config');
const menu = require('./lib/menu');
const browser = require('./lib/browser');

app.on('ready', () => {
    config.init();
    menu.init();
    browser.init();
    browser.loadHome();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
