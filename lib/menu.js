const { Menu } = require('electron');
const event = require('./event');

function getTemplate() {
    return [{
        label: 'Twitter',
        submenu: [{
            label: 'Quit',
            accelerator: 'Command+Q',
            click: () => { event.emit('select-quit'); }
        }],
    }, {
        label: 'View',
        submenu: [{
            label: 'Home',
            click: () => { event.emit('select-home'); }
        }, {
            label: 'Forward',
            click: () => { event.emit('select-forward'); }
        }, {
            label: 'Back',
            click: () => { event.emit('select-back'); }
        }]
    }];
}

exports.init = function() {
    const menu = Menu.buildFromTemplate(getTemplate());
    Menu.setApplicationMenu(menu);
};
