import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';
import event from './event.js';
import { PromptKind, PromptOptions, PromptView } from './views/prompt.js';

let activePromptView: PromptView | null = null;

export function initPrompt(): void {
  ipcMain.handle('prompt-complete', handlePromptComplete);
}

export function showPrompt(
  kind: PromptKind,
  parent: BrowserWindow | null,
  options: PromptOptions,
): void {
  activePromptView?.close();

  const view = new PromptView(parent, options, kind);
  activePromptView = view;
  view.onClosed(() => {
    if (activePromptView === view) activePromptView = null;
  });
  view.show();
}

function handlePromptComplete(ipcEvent: IpcMainInvokeEvent, value: unknown, button: unknown): void {
  const view = activePromptView;
  if (!view || !view.isSender(ipcEvent.sender)) return;

  activePromptView = null;
  view.close();
  if (button === 'cancel' || typeof value !== 'string' || value === '') return;

  emitDecision(view.kind, value);
}

function emitDecision(kind: PromptKind, value: string): void {
  switch (kind) {
    case 'find-topics':
      event.emit('decide-find-topics', value);
      break;
    case 'user-id':
      event.emit('decide-user-id', value);
      break;
    case 'open-url':
      event.emit('decide-open-url', value);
      break;
  }
}
