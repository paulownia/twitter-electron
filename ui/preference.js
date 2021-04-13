/* global api */
document.addEventListener('DOMContentLoaded', async () => {
  const externalBrowser = document.getElementById('externalBrowser');

  externalBrowser.addEventListener('change', async (e) => {
    e.preventDefault();
    await api.setExternalBrowser(externalBrowser.value);
  });

  const defaultVal = await api.getExternalBrowser();

  if (defaultVal) {
    externalBrowser.value = defaultVal;
  }
});
