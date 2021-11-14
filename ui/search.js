/* global api */
document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(location.search);
  const type = params.get('type');

  const search = document.getElementById('search');
  if (type === 'jumpUserPage') {
    search.placeholder = 'Go User Page...';
  } else if (type === 'findTopics') {
    search.placeholder = 'Find Topic...';
  } else {
    search.value = type;
  }
  search.focus();

  search.addEventListener('keypress', (e) => {
    if (e.key !== 'Enter') {
      return;
    }

    e.preventDefault();  // prevent submit

    let raw = search.value;
    if (!raw) {
      api.searchEnd();
      return;
    }

    const encoded = encodeURIComponent(raw);

    api.search(encoded, type);
    api.searchEnd();
    search.value = '';
  });
});
