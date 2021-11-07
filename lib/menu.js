const { Menu, MenuItem } = require('electron');

const event = require('./event');

exports.init = function() {
  const menu = Menu.getApplicationMenu();

  // add history to menu bar
  menu.insert(4, menuHistory());

  // add Preferences to Appliation Menu (0)
  const appMenu = menu.items[0].submenu;
  appMenu.insert(2, new MenuItem({type: 'separator'}));
  appMenu.insert(2, menuPreferences());

  // add FindTopics, GoUserPage to Edit Menu (2)
  const editMenu = menu.items[2].submenu;
  editMenu.append(new MenuItem({type: 'separator'}));
  editMenu.append(menuFindTopics());
  editMenu.append(menuGoUserPage());

  // apply changes
  Menu.setApplicationMenu(menu);
};

function menuFindTopics() {
  return new MenuItem({
    label: 'Find Topics...',
    type: 'normal',
    accelerator: 'Command+F',
    click: (_menuItem, _browserWindow, _event) => {
      event.emit('select-find-topics');
    }
  });
}

function menuGoUserPage() {
  return new MenuItem({
    label: 'Go User Page...',
    type: 'normal',
    accelerator: 'Command+Shift+F',
    click: (_menuItem, _browserWindow, _event) => {
      event.emit('select-go-user-page');
    }
  });
}

function menuHistory() {
  return new MenuItem({
    label: 'History',
    type: 'submenu',
    submenu: Menu.buildFromTemplate([
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
