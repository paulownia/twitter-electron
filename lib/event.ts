import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

interface EventArgs {
  'select-internal-link': [string];
  'select-forward': [];
  'select-back': [];
  'select-find-topics': [];
  'select-logout': [];
  'select-preferences': [];
  'select-go-user-page': [];
  'select-open-url': [];
  'select-reset-window-size': [];
};

type EventName = keyof EventArgs;

export const event = {
  on<K extends EventName>(eventName: K, listener: (...args: EventArgs[K]) => void): void {
    eventEmitter.on(eventName, listener);
  },
  emit<K extends EventName>(eventName: K, ...args: EventArgs[K]): void {
    eventEmitter.emit(eventName, ...args);
  },
} as const;
