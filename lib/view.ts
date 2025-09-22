import { clipboard } from 'electron';

import event from './event.js';
import { isXUrl } from './link.js';
import { isValidUserId } from './user-id.js';
import { PreferenceView } from './views/preference.js';
import { PromptView } from './views/prompt.js';
import { TimelineView } from './views/timeline.js';

const preferenceView = new PreferenceView();
const promptView = new PromptView();
const timelineView = new TimelineView();

export function showDefaultView() {
  timelineView.show();
}

/** ショートカットとメニュー選択のハンドリング */
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find-topics', () => {
  promptView
    .show(timelineView.window, {
      title: 'Find Topics',
      placeholder: 'input keyword',
      okLabel: 'Find',
    })
    .then(keyword => timelineView.loadSearchPage(keyword))
    .catch(() => {
      // ユーザがキャンセルした場合は何もしない
    });
});
event.on('select-logout', () => timelineView.loadLogoutPage());
event.on('select-preferences', () => preferenceView.show());
event.on('select-go-user-page', () => {
  promptView
    .show(timelineView.window, {
      title: 'Go User Page',
      placeholder: 'input user id',
      okLabel: 'Go',
      defaultValue: getUserIdFromClipboard(),
      selected: 'true', // 型エラー回避のためtrueを文字列に
    })
    .then(id => timelineView.loadUserPage(id))
    .catch(() => {
      // ユーザがキャンセルした場合は何もしない
    });
});
event.on('select-open-url', () => {
  promptView
    .show(timelineView.window, {
      title: 'Open URL',
      defaultValue: getInternalURLFromClipboard(),
      placeholder: 'input X URL',
      okLabel: 'Open',
      promptType: 'url',
    })
    .then(url => timelineView.loadInternalUrl(url))
    .catch(() => {
      // ユーザがキャンセルした場合は何もしない
    });
});
event.on('select-internal-link', (url: string) => timelineView.loadXPage(url));

event.on('select-reset-window-size', () => {
  timelineView.resetWindowSize();
});

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
