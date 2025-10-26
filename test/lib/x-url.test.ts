import assert from 'node:assert';
import { describe, it } from 'node:test';
import { isXUrl } from '../../lib/x-url.js';

describe('url.ts', () => {
  describe('isXUrl', () => {
    it('should return true for valid x.com URLs', () => {
      const urls = [
        'https://x.com/',
        'https://x.com/somepath',
        'https://x.com/search?q=test',
        'https://x.com/@user',
      ];
      for (const urlString of urls) {
        assert.strictEqual(isXUrl(urlString), true, `Expected that isXUrl returns true for URL: ${urlString}`);
        assert.strictEqual(isXUrl(new URL(urlString)), true, `Expected that isXUrl returns true for URL: ${urlString}`);
      }
    });
  });
});
