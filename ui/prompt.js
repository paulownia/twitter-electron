/* global api */
const acceptableTypes = [
  'text',
  'url',
  'email',
  'password',
  'search',
  'tel',
  'number',
];

try {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const title = params.get('title');
  if (title) {
    document.title = title;
    document.querySelector('#title span').textContent = title + ':';
  }

  const defaultValue = params.get('defaultValue');
  if (defaultValue) {
    document.getElementById('prompt').setAttribute('value', defaultValue);
  }
  const placeholder = params.get('placeholder');
  if (placeholder) {
    document.getElementById('prompt').setAttribute('placeholder', placeholder);
  }
  const okLabel = params.get('okLabel');
  if (okLabel) {
    document.getElementById('ok').setAttribute('value', okLabel);
  }
  const cancelLabel = params.get('cancelLabel');
  if (cancelLabel) {
    document.getElementById('cancel').setAttribute('value', cancelLabel);
  }
  const promptType = params.get('promptType');
  if (acceptableTypes.includes(promptType)) {
    document.getElementById('prompt').setAttribute('type', promptType);
  }
} catch (e) {
  // ignore
}

const okButton = document.getElementById('ok');
const cancelButton = document.getElementById('cancel');

okButton.addEventListener('click', async() => {
  const value = document.getElementById('prompt').value;
  await api.promptComplete(value, 'ok');
});

cancelButton.addEventListener('click', async() => {
  await api.promptComplete(null, 'cancel');
});

const body = document.documentElement;
body.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    e.preventDefault();
    cancelButton.click();
  }
  if (e.key === 'Enter' && e.shiftKey) {
    e.preventDefault();
    okButton.click();
  }
}, true);

// Focus the prompt input
const prompt = document.getElementById('prompt');
prompt.focus();

// Prevent implicit submission
document.addEventListener('submit', (e) => e.preventDefault());

