const config = require('./config');
const open = require('open');
const { shell } = require('electron');

exports.openWithExternalBrowser = (url) => {
  const browser = config.get('externalBrowser');
  if (!browser || browser === 'default') {
    shell.openExternal(url);
  } else if (browser === 'firefox' || browser === 'chrome') {
    open(url, {app: {name: open.apps[browser]}}).catch((_) => {
      // do nothing
    });
  } else {
    open(url, {app: {name: browser}}).catch((_) => {
      // do nothing
    });
  }
};

exports.isTwitter = (url) => {
  return url.startsWith('https://twitter.com/') || url.startsWith('https://x.com/');
};

