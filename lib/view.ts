import { clipboard } from 'electron';

import event from './event.js';
import { showPrompt } from './prompt.js';
import { isValidUserId } from './user-id.js';
import { PreferenceView } from './views/preference.js';
import { TimelineView } from './views/timeline.js';
import { isXUrl } from './x-url.js';

const preferenceView = new PreferenceView();
const timelineView = new TimelineView();

export function showDefaultView() {
  timelineView.show();
}

/** ショートカットとメニュー選択のハンドリング */
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find-topics', () => {
  showPrompt('find-topics', timelineView.window, {
    title: 'Find Topics',
    placeholder: 'input keyword',
    okLabel: 'Find',
  });
});
event.on('select-logout', () => timelineView.loadLogoutPage());
event.on('select-preferences', () => preferenceView.show());
event.on('select-go-user-page', () => {
  showPrompt('user-id', timelineView.window, {
    title: 'Go User Page',
    placeholder: 'input user id',
    okLabel: 'Go',
    defaultValue: getUserIdFromClipboard(),
    selected: 'true', // 型エラー回避のためtrueを文字列に
  });
});
event.on('select-open-url', () => {
  showPrompt('open-url', timelineView.window, {
    title: 'Open URL',
    defaultValue: getInternalURLFromClipboard(),
    placeholder: 'input X URL',
    okLabel: 'Open',
    promptType: 'url',
  });
});

event.on('decide-find-topics', keyword => timelineView.loadSearchPage(keyword));
event.on('decide-user-id', id => timelineView.loadUserPage(id));
event.on('decide-open-url', url => timelineView.loadInternalUrl(url));

event.on('select-internal-link', (url: string) => timelineView.loadXPage(url));

event.on('select-reset-window-size', () => timelineView.resetWindowSize());

/**
 * Clipboardの値がユーザIDとして妥当な場合はその値を返す。
 * ユーザIDとして妥当でない場合は空文字列を返す。
 * 前後に空白や制御文字がある場合は取り除いて返す。
 * @return ユーザIDまたは空文字列
 */
function getUserIdFromClipboard(): string {
  const text = clipboard.readText();

  const cleanedText = text.trim();

  const maybeUserId = cleanedText.replace(/^@/, '');

  // 判定は`@`抜きの文字列に対して行うが、返すのは`@`付きで良い
  return isValidUserId(maybeUserId) ? cleanedText : '';
}

/**
 * Clipboardの値がXのRLの場合はその値を返す。
 * XのURLでない場合は空文字列を返す
 * @return XのURLまたは空文字列。
 */
function getInternalURLFromClipboard(): string {
  const text = clipboard.readText();
  if (text && isXUrl(text)) {
    return text;
  } else {
    return '';
  }
}
