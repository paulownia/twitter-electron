export type Browser = 'firefox' | 'chrome' | 'edge' | 'safari' | 'default';

export function isValidBrowser(browser: unknown): browser is Browser {
  if (typeof browser !== 'string') {
    return false;
  }
  return ['firefox', 'chrome', 'edge', 'safari', 'default'].includes(browser);
}
