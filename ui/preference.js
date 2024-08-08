/* global api */
/// <reference path="../lib/preload/preference.d.ts" />
(async () => {
  // デフォルトブラウザ
  const externalBrowser = document.getElementById('externalBrowser');

  externalBrowser.addEventListener('change', async (e) => {
    e.preventDefault();
    await api.setExternalBrowser(externalBrowser.value);
  });

  const defaultVal = await api.getExternalBrowser();

  if (defaultVal) {
    externalBrowser.value = defaultVal;
  }

  // キャッシュ
  const cacheSize = document.getElementById('cacheSize');
  const cacheSizeValue = await api.getCacheSize();
  cacheSize.value = (cacheSizeValue / 1024 / 1024).toFixed(2);

  const cacheClear = document.getElementById('cacheClear');
  cacheClear.addEventListener('click', async (e) => {
    e.preventDefault();
    await api.clearCache();
    const cacheSizeValue = await api.getCacheSize();
    cacheSize.value = (cacheSizeValue / 1024 / 1024).toFixed(2);
  });
})();


