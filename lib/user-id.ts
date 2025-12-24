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

export function isUserPageUrl(urlStrOrPathname: string): boolean {
  // urlの形式が https:// スタートの場合はXのURLかどうかをチェックし、パス名を取得する
  // /から始まっている場合はx.comのユーザーページの可能性があるのでそのままパス名として扱う
  const pathname = urlStringToPathname(urlStrOrPathname);
  if (pathname === null) {
    return false;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 1) {
    return isValidUserId(segments[0]);
  }
  return false;
}

export function isStatusPageUrl(urlStrOrPathname: string): boolean {
  // urlの形式が https:// スタートの場合はXのURLかどうかをチェックし、パス名を取得する
  // /から始まっている場合はx.comのユーザーページの可能性があるのでそのままパス名として扱う
  const pathname = urlStringToPathname(urlStrOrPathname);
  if (pathname === null) {
    return false;
  }

  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 1 && segments[1] === 'status') {
    return isValidUserId(segments[0]);
  }
  return false;
}

/**
 * この関数は, isUserPageUrl(url) が true を返すURLからユーザIDを抽出します。isUserPageUrl(url) で検査済みであることが前提です。
 * @param url
 * @returns
 */
export function extractUserIdFromUrl(urlStrOrPathname: string): string  {
// isUserPageUrl(url) で検査済みで前提あること
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
