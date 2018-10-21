const { Menu, app, shell } = require('electron');

const defaultMenu = require('electron-default-menu');

const event = require('./event');

const historyMenuTemplate = {
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
};

const findSubmenuTemplate = [{
    type: 'separator'
}, {
    label: 'Find...',
    accelerator: 'Command+F',
    click: () => { event.emit('select-find'); }
}];

exports.init = function() {
    const menuTemplate = defaultMenu(app, shell);
    menuTemplate.splice(3, 0, historyMenuTemplate);

    const viewMenu = menuTemplate[2];   // view
    viewMenu.submenu.push(...findSubmenuTemplate);

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
};
