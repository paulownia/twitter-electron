import { Menu, MenuItem, MenuItemConstructorOptions } from 'electron';

import event from './event.js';

export function initMenu(): void {
  const menu = Menu.getApplicationMenu();
  if (!menu) return;

  // add history and navigation menu to menu bar
  menu.insert(4, menuHistory());
  menu.insert(5, menuNavigate());

  // add Preferences to Application Menu (0)
  const appMenu = menu.items[0].submenu;
  appMenu?.insert(2, new MenuItem({ type: 'separator' }));
  appMenu?.insert(2, menuPreferences());

  // add reset window
  const windowMenu = menu.items[6].submenu;
  windowMenu?.insert(1, menuResetWindowSize());

  // apply changes
  Menu.setApplicationMenu(menu);
}

function menuHistory(): MenuItem {
  return new MenuItem({
    label: 'History',
    type: 'submenu',
    submenu: Menu.buildFromTemplate([
      {
        label: 'Home',
        accelerator: 'Shift+Command+H',
        click: () => { event.emit('select-internal-link', '/home'); },
      },
      {
        label: 'Forward',
        accelerator: 'Command+]',
        click: () => { event.emit('select-forward'); },
      },
      {
        label: 'Back',
        accelerator: 'Command+[',
        click: () => { event.emit('select-back'); },
      },
      { type: 'separator' },
      {
        label: 'Logout',
        click: () => { event.emit('select-logout'); },
      },
    ] as MenuItemConstructorOptions[]),
  });
}

function menuNavigate(): MenuItem {
  return new MenuItem({
    label: 'Navigate',
    type: 'submenu',
    submenu: Menu.buildFromTemplate([
      {
        label: 'Settings',
        type: 'normal',
        click: () => { event.emit('select-internal-link', '/settings'); },
      },
      {
        label: 'Connected Apps',
        type: 'normal',
        click: () => { event.emit('select-internal-link', '/settings/connected_apps'); },
      },
      { type: 'separator' },
      {
        label: 'Topics...',
        type: 'normal',
        accelerator: 'Command+T',
        click: () => { event.emit('select-find-topics'); },
      },
      {
        label: 'User Page...',
        type: 'normal',
        accelerator: 'Command+U',
        click: () => { event.emit('select-go-user-page'); },
      },
      {
        label: 'X URL...',
        type: 'normal',
        accelerator: 'Command+L',
        click: () => { event.emit('select-open-url'); },
      },
    ] as MenuItemConstructorOptions[]),
  });
}

function menuPreferences(): MenuItem {
  return new MenuItem({
    label: 'Preferences',
    type: 'normal',
    accelerator: 'Command+,',
    click: () => { event.emit('select-preferences'); },
  });
}

function menuResetWindowSize(): MenuItem {
  return new MenuItem({
    label: 'Reset Size',
    type: 'normal',
    accelerator: 'Command+0',
    click: () => { event.emit('select-reset-window-size'); },
  });
}
