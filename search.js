/* global sendMessageToHost */
document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('search');
  search.focus();

  search.addEventListener('keypress', (e) => {
    if (e.keyCode !== 13) {  // enter
      return;
    }

    e.preventDefault();  // prevent submit

    let raw = search.value;
    if (!raw) {
      return;
    }

    const encoded = encodeURIComponent(raw);

    sendMessageToHost('search', encoded);
    sendMessageToHost('search-end');
    search.value = '';
  });
  search.addEventListener('blur', () => {
    sendMessageToHost('search-end');
    search.value = '';
  });
});
