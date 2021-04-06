/* global api */
document.addEventListener('DOMContentLoaded', async () => {
  const externalBrowser = document.getElementById('externalBrowser');

  externalBrowser.addEventListener('change', async (e) => {
    console.log(externalBrowser.value);
    e.preventDefault();
    await api.setExternalBrowser(externalBrowser.value);
  });

  const defaultVal = await api.getExternalBrowser();
  console.log(defaultVal);

  if (defaultVal) {
    externalBrowser.value = defaultVal;
  }
});
