const { remote } = require('electron');
const event = remote.require('./lib/event');

document.addEventListener('DOMContentLoaded', () => {
    const search = document.getElementById('search');
    search.addEventListener('keypress', (e) => {
        if (e.keyCode !== 13) {  // enter
            return;
        }

        e.preventDefault();  // prevent submit

        var raw = search.value;
        if (!raw) {
            return;
        }

        const encoded = encodeURIComponent(raw);

        event.emit('search',{ raw: raw, encoded: encoded });
    });
});