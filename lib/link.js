const config = require('./config');
const open = require('open');
const { shell } = require('electron');

exports.openWithExternalBrowser = (url) => {
  const browser = config.get('externalBrowser');
  if (!browser || browser === 'default') {
    shell.openExternal(url);
  } else if (browser === 'firefox' || browser === 'chrome') {
    open(url, {app: {name: open.apps[browser]}});
  } else {
    open(url, {app: {name: browser}});
  }
};

exports.isTwitter = (url) => {
  try {
    return new URL(url).hostname === 'twitter.com';
  } catch (_e) {
    return false;
  }
};
