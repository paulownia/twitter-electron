'use strict';

const { app } = require('electron');

const config = require('./lib/config');
const menu = require('./lib/menu');
const window = require('./lib/window');
const event = require('./lib/event');

app.on('ready', () => {
    config.init();
    menu.init();
    window.init();

});

app.on('window-all-closed', () => {
    app.quit();
});

event.on('select-quit', () => {
    app.quit();
});
