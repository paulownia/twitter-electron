import { clipboard } from 'electron';

import { event } from './event.js';
import { isTwitterURL } from './link.js';
import { PreferenceView } from './views/preference.js';
import { PromptView } from './views/prompt.js';
import { TimelineView } from './views/timeline.js';
import { isValidUserId } from './user-id.js';

const preferenceView = new PreferenceView();
const promptView = new PromptView();
export const timelineView = new TimelineView();

/** ショートカットとメニュー選択のハンドリング */
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find-topics', () => {
  promptView
    .show(timelineView.getView(), {
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
    .show(timelineView.getView(), {
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
    .show(timelineView.getView(), {
      title: 'Open URL',
      defaultValue: getInternalURLFromClipboard(),
      placeholder: 'input X URL',
      okLabel: 'Open',
      promptType: 'url',
    })
    .then(url => timelineView.loadRawURL(url))
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
 * 先頭が@の場合は@を除去して返す。
 * @return ユーザIDまたは空文字列
 */
function getUserIdFromClipboard(): string {
  const text = clipboard.readText();
  // 最初に@がついている場合は除去する
  const cleanedText = text.startsWith('@') ? text.slice(1) : text;

  return isValidUserId(cleanedText) ? cleanedText : '';
}

/**
 * Clipboardの値がXのRLの場合はその値を返す。
 * XのURLでない場合は空文字列を返す
 * @return XのURLまたは空文字列。
 */
function getInternalURLFromClipboard(): string {
  const text = clipboard.readText();
  if (text && isTwitterURL(text)) {
    return text;
  } else {
    return '';
  }
}

