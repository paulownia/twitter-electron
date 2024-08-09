/* global api */
/// <reference path="../lib/preload/prompt.d.ts" />
const acceptableTypes = [
  'text',
  'url',
  'email',
  'password',
  'search',
  'tel',
  'number',
];

const okButton = document.getElementById('ok');
const cancelButton = document.getElementById('cancel');
const inputField = document.getElementById('prompt');

try {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  const title = params.get('title');
  if (title) {
    document.title = title;
    document.querySelector('#title span').textContent = title + ':';
  }
  const okLabel = params.get('okLabel');
  if (okLabel) {
    okButton.setAttribute('value', okLabel);
  }
  const cancelLabel = params.get('cancelLabel');
  if (cancelLabel) {
    cancelButton.setAttribute('value', cancelLabel);
  }

  const promptType = params.get('promptType');
  if (acceptableTypes.includes(promptType)) {
    inputField.setAttribute('type', promptType);
  }
  const defaultValue = params.get('defaultValue');
  if (defaultValue) {
    inputField.value = defaultValue;
  }
  const placeholder = params.get('placeholder');
  if (placeholder) {
    inputField.setAttribute('placeholder', placeholder);
  }
  const selected = params.get('selected');
  if (selected === 'true') {
    inputField.select();
  } else {
    const len = inputField.value.length;
    if (len > 0) {
      inputField.setSelectionRange(len, len);
    }
  }
} catch (e) {
  // ignore
}

okButton.addEventListener('click', async() => {
  const value = inputField.value;
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
  } else if (e.key === 'Enter' && !e.isComposing) {
    e.preventDefault();
    okButton.click();
  }
}, true);

// Focus the prompt input
inputField.focus();

// Prevent implicit submission
document.addEventListener('submit', (e) => e.preventDefault());

