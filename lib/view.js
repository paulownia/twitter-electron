import { clipboard } from 'electron';

import { event } from './event.js';
import { isTwitterURL } from './link.js';
import { PreferenceView } from './views/preference.js';
import { PromptView } from './views/prompt.js';
import { TimelineView } from './views/timeline.js';

const preferenceView = new PreferenceView();
const promptView = new PromptView();
export const timelineView = new TimelineView();

/** ショートカットとメニュー選択のハンドリング */
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find-topics', () => {
  promptView
    .show(timelineView.view, {
      title: 'Find Topics',
      placeholder: 'input keyword',
      okLabel: 'Find',
    })
    .then(keyword => timelineView.loadSearchPage(keyword))
    .catch(() => {});
});
event.on('select-logout', () => timelineView.loadLogoutPage());
event.on('select-preferences', () => preferenceView.show());
event.on('select-go-user-page', () => {
  promptView
    .show(timelineView.view, {
      title: 'Go User Page',
      placeholder: 'input user id',
      okLabel: 'Go',
      defaultValue: getDefaultValue(),
      selected: true,
    })
    .then(id => timelineView.loadUserPage(id))
    .catch(() => {});
});
event.on('select-open-url', () => {
  promptView
    .show(timelineView.view, {
      title: 'Open URL',
      defaultValue: getDefaultValueForOpenURL(),
      placeholder: 'input X URL',
      okLabel: 'Open',
      promptType: 'url',
    })
    .then(url => timelineView.loadRawURL(url))
    .catch(() => {});
});
event.on('select-internal-link', url => timelineView.loadXPage(url));


function getDefaultValue() {
  return clipboard.readText();
}

function getDefaultValueForOpenURL() {
  const text = clipboard.readText();
  if (text && isTwitterURL(text)) {
    return text;
  } else {
    return '';
  }
}

