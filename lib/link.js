const config = require('./config');
const log = require('./log');
const open = require('open');
const { shell } = require('electron');

/**
 * Open URL with external browser ansyncronously.
 * @param {string} url
 * @returns {Promise<void>}
 */
exports.openWithExternalBrowser = async (url) => {
  if (typeof url !== 'string') {
    log.error(`Failed to open ${url} with external browser, Invalid type`);
  }
  try {
    await openByString(url);
  } catch (error) {
    log.error(error);
  }
};

function openByString(urlStr) {
  try {
    return openByURL(new URL(urlStr));
  } catch (error) {
    return fail(`Failed to open '${urlStr}' as url; ${error.message}`);
  }
}

function openByURL(url) {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return fail(`Failed to open '${url}', Invalid HTTP URL`);
  }
  const browser = config.get('externalBrowser');
  if (!browser || browser === 'default') {
    return shell.openExternal(url.toString())
      .catch(e => fail(`Failed to open '${url}' with default browser; ${e.message}\n`));
  } else {
    const opt = { app: { name: open.apps[browser] || browser }};
    return open(url.toString(), opt)
      .catch(e => fail(`Failed to open '${url}' with ${browser}; ${e.message}\n`));
  }
}

function fail(message) {
  return Promise.reject(new Error(message));
}

/**
 * Returns true if the given url is twitter's one
 *
 * @param {string|URL} url
 * @returns {boolean}
 */
exports.isTwitter = (url) => {
  if (!url) {
    return false;
  } else if (typeof url === 'string') {
    return url.startsWith('https://twitter.com/') || url.startsWith('https://x.com/');
  } else if (url instanceof URL) {
    return (url.host === 'twitter.com' || url.host === 'x.com') && url.protocol === 'https:';
  } else {
    return false;
  }
};

