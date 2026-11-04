window.addEventListener('contextmenu', (event) => {
  if (event.target instanceof HTMLImageElement) {
    // Xのハンドラより先に伝播を止める。preventDefaultするとElectron側のメニューも出なくなる。
    event.stopImmediatePropagation();
  }
}, { capture: true });
