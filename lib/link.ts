import { shell } from 'electron';
import open from 'open';
import config from './config.js';
import { getLogger } from './log.js';

const log = getLogger();

// Open a URL with the external browser asynchronously
export async function openWithExternalBrowser(url: string): Promise<void> {
  try {
    await openByString(url);
  } catch (error) {
    log.error(error);
  }
}

function openByString(urlStr: string): Promise<void> {
  return openByUrl(new URL(urlStr));
}

async function openByUrl(url: URL) {
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
