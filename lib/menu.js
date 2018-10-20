const { Menu } = require('electron');
const event = require('./event');

function getTemplate() {
    return [{
        label: 'History',
        submenu: [{
            label: 'Home',
            accelerator: 'Shift+Command+H',
            click: () => { event.emit('select-home'); }
        }, {
            label: 'Forward',
            accelerator: 'Command+]',
            click: () => { event.emit('select-forward'); }
        }, {
            label: 'Back',
            accelerator: 'Command+[',
            click: () => { event.emit('select-back'); }
        }]
    }];
}

exports.init = function() {
    const menu = Menu.buildFromTemplate(getTemplate());
    const defaultMenu = Menu.getApplicationMenu();
    defaultMenu.insert(3, menu.items[0]);
    Menu.setApplicationMenu(defaultMenu);
};
