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
  'download'
]);

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
