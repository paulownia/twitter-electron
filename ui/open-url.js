/* global api */
document.addEventListener('DOMContentLoaded', () => {
  try {
    const url = new URL(window.location.href);
    const urlParams = new URLSearchParams(url.search);
    const urlValue = urlParams.get('value');
    document.getElementById('prompt').value = urlValue;
  } catch (e) {
    // ignore
  }

  const open = document.getElementById('open');
  const cancel = document.getElementById('cancel');

  open.addEventListener('click', async() => {
    const url = document.getElementById('prompt').value;
    await api.openURL(url);
  });

  cancel.addEventListener('click', async() => {
    await api.openURL(null);
  });

  const body = document.documentElement;
  body.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      cancel.click();
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      open.click();
    }
  });
}, true);  // useCapture 最優先でイベントをキャプチャする
