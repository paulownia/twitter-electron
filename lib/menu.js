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
            label: 'Reload',
            click: () => { event.emit('select-reset'); }
        }]
    }];
}

exports.init = function() {
    const menu = Menu.buildFromTemplate(getTemplate());
    Menu.setApplicationMenu(menu);
};
