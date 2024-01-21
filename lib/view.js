'use strict';

const { PreferenceView } = require('./views/preference');
const { TimelineView } = require('./views/timeline');
const { SearchView } = require('./views/search');
const { OpenURLView } = require('./views/open-url');
const event = require('./event');

const preferenceView = new PreferenceView();
const timelineView = new TimelineView();
const searchView = new SearchView();
const openURLView = new OpenURLView();

exports.timelineView = timelineView;
exports.searchView = searchView;
exports.preferenceView = preferenceView;
exports.openURLView = openURLView;

/** ショートカットとメニュー選択のハンドリング */
event.on('select-home', () => timelineView.loadHomePage());
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find-topics', () => searchView.show(timelineView.view, {type: 'findTopics'}));
event.on('select-logout', () => timelineView.loadLogoutPage());
event.on('select-preferences', () => preferenceView.show());
event.on('select-go-user-page', () => searchView.show(timelineView.view, {type: 'jumpUserPage'}));
event.on('select-open-url', () => {
  openURLView
    .prompt(timelineView.view)
    .then(url => timelineView.loadURL(url))
    .catch(() => {});
});


