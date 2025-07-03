import { shell } from 'electron';
import open from 'open';
import config from './config.js';
import { log } from './log.js';

// Open a URL with the external browser asynchronously
export async function openWithExternalBrowser(url: string): Promise<void> {
  try {
    await openByString(url);
  } catch (error) {
    log.error(error);
  }
}

function openByString(urlStr: string): Promise<void> {
  return openByURL(new URL(urlStr));
}

async function openByURL(url: URL) {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`Failed to open '${url}', Invalid HTTP URL`);
  }
  const browser = config.get('externalBrowser');

  try {
    if (!browser || browser === 'default') {
      await shell.openExternal(url.toString());
    } else {
      const opt = { app: { name: browser }};
      await open(url.toString(), opt);
    }
  } catch (e: unknown) {
    throw new Error(`Failed to open '${url}' with ${browser}`, { cause: e });
  }
}

// Returns true if the given url is a Twitter (X) url
export function isTwitterURL(url: string | URL): boolean {
  if (!url) {
    return false;
  } else if (typeof url === 'string') {
    return url.startsWith('https://twitter.com/') || url.startsWith('https://x.com/');
  } else if (url instanceof URL) {
    return (url.host === 'twitter.com' || url.host === 'x.com') && url.protocol === 'https:';
  } else {
    return false;
  }
}

