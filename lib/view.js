'use strict';

const { PreferenceView } = require('./views/preference');
const { TimelineView } = require('./views/timeline');
const { SearchView } = require('./views/search');
const event = require('./event');

const preferenceView = new PreferenceView();
const timelineView = new TimelineView();
const searchView = new SearchView();

/** 初期化 */
exports.init = () => timelineView.loadHomePage();

/** Timeline表示 */
exports.showTimeLine = () => timelineView.show();

/** 検索実行 */
exports.search = (keyword) => timelineView.loadSearchPage(keyword);

/** 検索窓を閉じる */
exports.searchEnd = () => searchView.close();

/** ショートカットとメニュー選択のハンドリング */
event.on('select-home', () => timelineView.loadHomePage());
event.on('select-forward', () => timelineView.goForward());
event.on('select-back', () => timelineView.goBack());
event.on('select-find', () => searchView.show(timelineView.view));
event.on('select-logout', () => timelineView.loadLogoutPage());
event.on('select-preferences', () => preferenceView.show());
