export type Browser = 'firefox' | 'chrome' | 'edge' | 'safari' | 'default';

export function isValidBrowser(browser: string): browser is Browser {
  return ['firefox', 'chrome', 'edge', 'safari', 'default'].includes(browser);
}
