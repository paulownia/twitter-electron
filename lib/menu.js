const { Menu, MenuItem } = require('electron');

const event = require('./event');

exports.init = function() {
  const menu = Menu.getApplicationMenu();

  // add history and navitation menu to menu bar
  menu.insert(4, menuHistory());
  menu.insert(5, menuNavigate());

  // add Preferences to Appliation Menu (0)
  const appMenu = menu.items[0].submenu;
  appMenu.insert(2, new MenuItem({type: 'separator'}));
  appMenu.insert(2, menuPreferences());

  // apply changes
  Menu.setApplicationMenu(menu);
};

function menuHistory() {
  return new MenuItem({
    label: 'History',
    type: 'submenu',
    submenu: Menu.buildFromTemplate([
      {
        label: 'Home',
        accelerator: 'Shift+Command+H',
        click: () => { event.emit('select-internal-link', '/home'); }
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
    ])
  });
}

function menuNavigate() {
  return new MenuItem({
    label: 'Navigate',
    type: 'submenu',
    submenu: Menu.buildFromTemplate([
      {
        label: 'Settings',
        type: 'normal',
        click: () => { event.emit('select-internal-link', '/settings'); }
      }, {
        label: 'Connected Apps',
        type: 'normal',
        click: () => { event.emit('select-internal-link', '/settings/connected_apps'); }
      }, {
        type: 'separator'
      }, {
        label: 'Topics...',
        type: 'normal',
        accelerator: 'Command+T',
        click: (_menuItem, _browserWindow, _event) => {
          event.emit('select-find-topics');
        }
      }, {
        label: 'User Page...',
        type: 'normal',
        accelerator: 'Command+U',
        click: (_menuItem, _browserWindow, _event) => {
          event.emit('select-go-user-page');
        }
      }, {
        label: 'X URL...',
        type: 'normal',
        accelerator: 'Command+L',
        click: (_menuItem, _browserWindow, _event) => {
          event.emit('select-open-url');
        }
      }
    ])
  });
}

function menuPreferences() {
  return new MenuItem({
    label: 'Preferences',
    type: 'normal',
    accelerator: 'Command+,',
    click: () => event.emit('select-preferences'),
  });
}
