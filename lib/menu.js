const { Menu, MenuItem } = require('electron');

const event = require('./event');

const historyMenuTemplate = [
  {
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
  }, {
    type: 'separator'
  }, {
    label: 'Logout',
    click: () => { event.emit('select-logout'); }
  }
];

exports.init = function() {
  const menu = Menu.getApplicationMenu();
  addFindToViewMenu(menu);
  addHistoryToMenuBar(menu);
  addPreferencesToAppMenu(menu);
  Menu.setApplicationMenu(menu);
};

/**
 * add `find` menu item to `view` Submenu
 * @param menu ApplicationMenu
 */
function addFindToViewMenu(menu) {
  const viewMenuItem = menu.items[2]; // view?
  viewMenuItem.submenu.append(new MenuItem({type: 'separator'}));

  viewMenuItem.submenu.append(new MenuItem({
    label: 'Find Topics...',
    type: 'normal',
    accelerator: 'Command+F',
    click: (_menuItem, _browserWindow, _event) => {
      event.emit('select-find-topics');
    }
  }));

  viewMenuItem.submenu.append(new MenuItem({
    label: 'Go User Page...',
    type: 'normal',
    accelerator: 'Command+Shift+F',
    click: (_menuItem, _browserWindow, _event) => {
      event.emit('select-go-user-page');
    }
  }));
}


/**
 * add `history` menu to menu bar
 * @parem menu ApplicationMenu
 */
function addHistoryToMenuBar(menu) {
  const historyMenuItem = new MenuItem({
    label: 'History',
    type: 'submenu',
    submenu: Menu.buildFromTemplate(historyMenuTemplate)
  });

  menu.insert(4, historyMenuItem);
}


/**
 * add `preferences` menu item to app menu
 * @param menu ApplicationMenu
 */
function addPreferencesToAppMenu(menu) {
  const preferenceMenuItem = new MenuItem({
    label: 'Preferences',
    type: 'normal',
    accelerator: 'Command+,',
    click: () => event.emit('select-preferences'),
  });

  menu.items[0].submenu.insert(2, new MenuItem({type: 'separator'}));
  menu.items[0].submenu.insert(2, preferenceMenuItem);
}
