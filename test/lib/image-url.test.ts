import assert from 'node:assert';
import { describe, it } from 'node:test';
import { getOriginalImageUrl } from '../../lib/image-url.js';

describe('image-url.ts', () => {
  describe('getOriginalImageUrl', () => {
    it('replaces an existing name parameter with orig', () => {
      const url = 'https://pbs.twimg.com/media/example?format=jpg&name=small';

      assert.strictEqual(
        getOriginalImageUrl(url),
        'https://pbs.twimg.com/media/example?format=jpg&name=orig',
      );
    });

    it('replaces name when it is not the final query parameter', () => {
      const url = 'https://pbs.twimg.com/media/example?name=medium&format=png';

      assert.strictEqual(
        getOriginalImageUrl(url),
        'https://pbs.twimg.com/media/example?name=orig&format=png',
      );
    });

    it('adds name when the parameter is absent', () => {
      const url = 'https://pbs.twimg.com/media/example?format=webp';

      assert.strictEqual(
        getOriginalImageUrl(url),
        'https://pbs.twimg.com/media/example?format=webp&name=orig',
      );
    });

    it('preserves other query parameters', () => {
      const url = 'https://pbs.twimg.com/media/example?format=jpg&name=large&token=abc123';

      assert.strictEqual(
        getOriginalImageUrl(url),
        'https://pbs.twimg.com/media/example?format=jpg&name=orig&token=abc123',
      );
    });

    it('does not depend on the characters in the existing name value', () => {
      const url = 'https://pbs.twimg.com/media/example?format=jpg&name=%E5%B0%8F';

      assert.strictEqual(
        getOriginalImageUrl(url),
        'https://pbs.twimg.com/media/example?format=jpg&name=orig',
      );
    });
  });
});
