import { isXUrl } from './x-url.js';

const unavailableUserIds = new Set([
  'login',
  'logout',
  'search',
  'home',
  'notifications',
  'messages',
  'i',
  'settings',
  'account',
  'explore',
  'about',
  'help',
  'tos',
  'privacy',
  'jobs',
  'download',
]);

/**
 * ユーザページのパス判定用キーワード一覧
 * `/${user_id}/${content}` のcontentに当てはまるもの
 */
const userTabPaths = [
  'with_replies', // ユーザページのリプライ
  'highlights',   // ユーザページのハイライト
  'media'         // ユーザページのメディア
]

/**
 * ユーザ個別のページかどうか判定。以下のいずれかにマッチするかどうか？
 *  - `/${user-id}`
 *  - `/${user-id}/statuses/${status-id}`
 *  - `/${user-id}/statuses/${status-id}/photo/${num}`
 *  - `/${user-id}/${tab-path}`
 */
export function isUserContentPage(urlStrOrPathname: string): boolean {
  const pathname = urlStringToPathname(urlStrOrPathname);
  if (pathname === null) {
    return false;
  }
  const segments = pathname.split('/').filter(Boolean);  // 先頭要素は空文字なので除去
  if (segments.length === 0) {
    return false;
  }
  if (!isValidUserId(segments[0])) {
    return false;
  }

  switch (segments.length) {
    case 1:
      return true;
    case 2:
      return userTabPaths.includes(segments[1]);
    case 3:
    case 5:
      return segments[1] === 'status';

    default:
      return false;

  }
}

/**
 * ユーザIDとして妥当かどうかを判定する。
 * 妥当なユーザIDとは、英数字とアンダースコア(_)のみで構成され、3文字以上で、特定の予約語でないもの。
 *
 * @param maybeUserId 判定したい文字列
 * @return 妥当なユーザIDであればtrue、そうでなければfalse
 */
export function isValidUserId(maybeUserId: string) {
  if (maybeUserId.length < 3) {
    return false; // 3文字以下のidは存在しない（はず）
  }
  if (!maybeUserId.match(/^[a-zA-Z0-9_]+$/)) {
    return false; // 英数字とアンダースコア以外の文字が含まれている
  }
  if (unavailableUserIds.has(maybeUserId.toLowerCase())) {
    return false; // 特定の予約語が含まれている（大文字小文字を区別しない）
  }
  return true;
}

/**
 * この関数は, isUserContentPage(url) が true を返すURLからユーザIDを抽出します。isUserContentPage(url) で検査済みであることが前提です。
 */
export function extractUserIdFromUrl(urlStrOrPathname: string): string  {
  const path = urlStringToPathname(urlStrOrPathname);
  if (path === null) {
    throw new Error(`Invalid URL or pathname: ${urlStrOrPathname}`);
  }
  const segments = path.split('/').filter(Boolean);
  const maybeUserId = segments.length >= 1 ? segments[0] : null;
  if (maybeUserId === null || !isValidUserId(maybeUserId)) {
    throw new Error(`Invalid user ID extracted from URL: ${segments[0]}`);
  }
  return maybeUserId;
}

function urlStringToPathname(url: string): string | null {
  if (isXUrl(url)) {
    return new URL(url).pathname;
  } else if (url.startsWith('/')) {
    return url;
  } else {
    return null;
  }
}
