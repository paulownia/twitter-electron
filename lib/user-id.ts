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
  if (!maybeUserId.match(/^[\w_]+$/)) {
    return false; // 英数字とアンダースコア以外の文字が含まれている
  }
  if (unavailableUserIds.has(maybeUserId)) {
    return false; // 特定の予約語が含まれている
  }
  return true;
}
