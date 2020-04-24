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

  // add `find` menu item to view menu
  const viewMenuItem = menu.items[2]; // view?
  const findMenuItem = new MenuItem({
    label: 'Find...',
    type: 'normal',
    accelerator: 'Command+F',
    click: (_menuItem, _browserWindow, _event) => {
      event.emit('select-find');
    }
  });

  viewMenuItem.submenu.append(new MenuItem({type: 'separator'}));
  viewMenuItem.submenu.append(findMenuItem);

  // add history menu
  const historyMenuItem = new MenuItem({
    label: 'History',
    type: 'submenu',
    submenu: Menu.buildFromTemplate(historyMenuTemplate)
  });

  menu.insert(4, historyMenuItem);

  Menu.setApplicationMenu(menu);
};
