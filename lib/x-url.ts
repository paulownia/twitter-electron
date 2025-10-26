/**
 * Returns true if the given url is a Twitter (X) url.
 * Now accepts twitter.com and x.com domains. but in future versions, maybe only x.com will be supported.
 */
export function isXUrl(url: string | URL): boolean {
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
