'use strict';

const { clipboard } = require('electron');

const { PreferenceView } = require('./views/preference');
const { TimelineView } = require('./views/timeline');
const { PromptView } = require('./views/prompt');
const event = require('./event');
const link = require('./link');

const preferenceView = new PreferenceView();
const timelineView = new TimelineView();
const promptView = new PromptView();

exports.timelineView = timelineView;
exports.preferenceView = preferenceView;
exports.promptView = promptView;

/** ショートカットとメニュー選択のハンドリング */
event.on('select-home', () => timelineView.loadHomePage());
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
    .then(url => timelineView.loadXPage(url))
    .catch(() => {});
});
event.on('select-internal-link', url => timelineView.loadInternalLink(url));


function getDefaultValueForOpenURL() {
  const text = clipboard.readText();
  if (text && link.isTwitter(text)) {
    return text;
  } else {
    return '';
  }
}

