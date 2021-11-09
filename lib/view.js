'use strict';

const { PreferenceView } = require('./views/preference');
const { TimelineView } = require('./views/timeline');
const { SearchView } = require('./views/search');
const event = require('./event');

const preferenceView = new PreferenceView();
const timelineView = new TimelineView();
const searchView = new SearchView();

exports.timelineView = timelineView;
exports.searchView = searchView;
exports.preferenceView = preferenceView;

/** ショートカットとメニュー選択のハンドリング */
event.on('select-home', () => timelineView.loadHomePage());
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find-topics', () => searchView.show(timelineView.view, {type: 'findTopics'}));
event.on('select-logout', () => timelineView.loadLogoutPage());
event.on('select-preferences', () => preferenceView.show());
event.on('select-go-user-page', () => searchView.show(timelineView.view, {type: 'jumpUserPage'}));