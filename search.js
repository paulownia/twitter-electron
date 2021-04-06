/* global api */
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
      api.searchEnd();
      return;
    }

    const encoded = encodeURIComponent(raw);

    api.search(encoded);
    api.searchEnd();
    search.value = '';
  });
});
