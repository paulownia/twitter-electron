import { getLogger } from './log.js';

const log = getLogger();

/**
 * Twitter (X) の検索URLのパターン
 */
export const searchUrlList = [
  'https://x.com/i/api/graphql/*/SearchTimeline?*',
  'https://x.com/search?*',
  'https://twitter.com/i/api/graphql/*/SearchTimeline?*',
  'https://twitter.com/search?*',
];

/**
 * 指定したURLオブジェクトの検索クエリに、スパム（インプレゾンビ）避けのキーワードを追加する
 * @param {URL} url
 * @returns {URL|null} フィルタが追加された新しいURLオブジェクト、追加する必要がない（＝検索URLではない、既に追加されている）場合はnull
 */
export function addSpamFilterToQuery(url: URL): URL | null {
  if (url.pathname.startsWith('/i/api/graphql/')) {
    return addSpamFilterToQueryForSearchApi(url);
  } else if (url.pathname.startsWith('/search')) {
    return addSpamFilterToQueryForSearchWeb(url);
  } else {
    return null;
  }
}

function addSpamFilterToQueryForSearchApi(url: URL): URL | null {
  const rawParamVariables = url.searchParams.get('variables');
  if (!rawParamVariables) return null;
  const paramVariables = decodeURIComponent(rawParamVariables);

  const variables = JSON.parse(paramVariables);
  const rawQuery = variables.rawQuery;
  if (!rawQuery) {
    return null;
  }
  if (rawQuery.includes('-source:Twitter_for_Advertisers')) {
    return null;
  }
  variables.rawQuery = rawQuery + ' -source:Twitter_for_Advertisers';
  const newParamVariables = JSON.stringify(variables);  // encodeURIComponent は不要、URLSearchParams がやってくれる

  log.info(`rewrite graphql query, variables=${newParamVariables}`);

  const newUrl = new URL(url.toString());
  newUrl.searchParams.set('variables', newParamVariables);
  return newUrl;
}

function addSpamFilterToQueryForSearchWeb(url: URL): URL | null {
  const q = url.searchParams.get('q');
  if (!q) {
    return null;
  }
  if (q.includes('-source:Twitter_for_Advertisers')) {
    return null;
  }
  const newQ = q + ' -source:Twitter_for_Advertisers';

  log.info(`rewrite search query, q=${newQ}`);

  const newUrl = new URL(url.toString());
  newUrl.searchParams.set('q', newQ);
  return newUrl;
}
