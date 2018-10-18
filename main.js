'use strict';

const { app } = require('electron');

const config = require('./lib/config');
const menu = require('./lib/menu');
const browser = require('./lib/browser');
const event = require('./lib/event');

app.on('ready', () => {
    config.init();
    menu.init();
    browser.init();

});

app.on('window-all-closed', () => {
    app.quit();
});

event.on('select-quit', () => {
    app.quit();
});
