import assert from 'node:assert';
import { describe, it } from 'node:test';
import { addSpamFilterToQuery, searchUrlList } from '../../lib/search.js';

describe('search.ts', () => {
  describe('searchUrlList', () => {
    it('should contain expected search URL patterns', () => {
      assert.strictEqual(searchUrlList.length, 4);
      assert.ok(searchUrlList.includes('https://x.com/i/api/graphql/*/SearchTimeline?*'));
      assert.ok(searchUrlList.includes('https://x.com/search?*'));
      assert.ok(searchUrlList.includes('https://twitter.com/i/api/graphql/*/SearchTimeline?*'));
      assert.ok(searchUrlList.includes('https://twitter.com/search?*'));
    });
  });

  describe('addSpamFilterToQuery', () => {
    describe('GraphQL API URLs', () => {
      it('should add spam filter to GraphQL search API query', () => {
        const variables = { rawQuery: 'test query' };
        const url = new URL('https://x.com/i/api/graphql/abc123/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        const resultVariables = JSON.parse(result.searchParams.get('variables') || '{}');
        assert.strictEqual(resultVariables.rawQuery, 'test query -source:Twitter_for_Advertisers');
      });

      it('should not modify if spam filter already exists in GraphQL query', () => {
        const variables = { rawQuery: 'test query -source:Twitter_for_Advertisers' };
        const url = new URL('https://x.com/i/api/graphql/abc123/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should return null if variables parameter is missing', () => {
        const url = new URL('https://x.com/i/api/graphql/abc123/SearchTimeline');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should return null if rawQuery is missing in variables', () => {
        const variables = { someOtherField: 'value' };
        const url = new URL('https://x.com/i/api/graphql/abc123/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should handle twitter.com GraphQL URL', () => {
        const variables = { rawQuery: 'test' };
        const url = new URL('https://twitter.com/i/api/graphql/xyz/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        const resultVariables = JSON.parse(result.searchParams.get('variables') || '{}');
        assert.strictEqual(resultVariables.rawQuery, 'test -source:Twitter_for_Advertisers');
      });

      it('should not modify original URL object', () => {
        const variables = { rawQuery: 'test query' };
        const url = new URL('https://x.com/i/api/graphql/abc123/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));
        const originalVariables = url.searchParams.get('variables');

        addSpamFilterToQuery(url);

        assert.strictEqual(url.searchParams.get('variables'), originalVariables);
      });

      it('should preserve other variables fields', () => {
        const variables = { rawQuery: 'test', count: 20, cursor: 'abc' };
        const url = new URL('https://x.com/i/api/graphql/abc123/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        const resultVariables = JSON.parse(result.searchParams.get('variables') || '{}');
        assert.strictEqual(resultVariables.count, 20);
        assert.strictEqual(resultVariables.cursor, 'abc');
      });
    });

    describe('Web search URLs', () => {
      it('should add spam filter to web search query', () => {
        const url = new URL('https://x.com/search?q=test+query');

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        assert.strictEqual(result.searchParams.get('q'), 'test query -source:Twitter_for_Advertisers');
      });

      it('should not modify if spam filter already exists in web search', () => {
        const url = new URL('https://x.com/search?q=test+-source:Twitter_for_Advertisers');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should return null if q parameter is missing', () => {
        const url = new URL('https://x.com/search');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should handle twitter.com web search URL', () => {
        const url = new URL('https://twitter.com/search?q=test');

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        assert.strictEqual(result.searchParams.get('q'), 'test -source:Twitter_for_Advertisers');
      });

      it('should not modify original URL object', () => {
        const url = new URL('https://x.com/search?q=test+query');
        const originalQ = url.searchParams.get('q');

        addSpamFilterToQuery(url);

        assert.strictEqual(url.searchParams.get('q'), originalQ);
      });

      it('should preserve other query parameters', () => {
        const url = new URL('https://x.com/search?q=test&f=live&src=typed_query');

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        assert.strictEqual(result.searchParams.get('f'), 'live');
        assert.strictEqual(result.searchParams.get('src'), 'typed_query');
      });

      it('should handle URL-encoded query string', () => {
        const url = new URL('https://x.com/search?q=test%20with%20spaces');

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        assert.strictEqual(result.searchParams.get('q'), 'test with spaces -source:Twitter_for_Advertisers');
      });
    });

    describe('non-search URLs', () => {
      it('should return null for non-search URL', () => {
        const url = new URL('https://x.com/user/status/123');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should return null for home timeline', () => {
        const url = new URL('https://x.com/home');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should return null for user profile', () => {
        const url = new URL('https://x.com/username');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });

      it('should return null for other GraphQL endpoints', () => {
        const url = new URL('https://x.com/i/api/graphql/abc123/UserTimeline');

        const result = addSpamFilterToQuery(url);

        assert.strictEqual(result, null);
      });
    });

    describe('edge cases', () => {
      it('should return null for empty query string in web search', () => {
        const url = new URL('https://x.com/search?q=');

        const result = addSpamFilterToQuery(url);

        // 空文字列はfalsyなので、nullが返される
        assert.strictEqual(result, null);
      });

      it('should handle query with only spaces', () => {
        const url = new URL('https://x.com/search?q=+++');

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        // URLSearchParamsは"+++"を"   "（3つのスペース）にデコードする
        assert.strictEqual(result.searchParams.get('q'), '    -source:Twitter_for_Advertisers');
      });

      it('should handle complex rawQuery with special characters', () => {
        const variables = { rawQuery: 'test "quoted" (parentheses) #hashtag' };
        const url = new URL('https://x.com/i/api/graphql/abc/SearchTimeline?variables=' + encodeURIComponent(JSON.stringify(variables)));

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        const resultVariables = JSON.parse(result.searchParams.get('variables') || '{}');
        assert.strictEqual(resultVariables.rawQuery, 'test "quoted" (parentheses) #hashtag -source:Twitter_for_Advertisers');
      });

      it('should handle query that contains -source but not the full filter', () => {
        const url = new URL('https://x.com/search?q=test+-source:other');

        const result = addSpamFilterToQuery(url);

        assert.ok(result instanceof URL);
        assert.strictEqual(result.searchParams.get('q'), 'test -source:other -source:Twitter_for_Advertisers');
      });
    });
  });
});
