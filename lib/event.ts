import { EventEmitter } from 'events';

const eventEmitter = new EventEmitter();

const EventNames = [
  'select-internal-link',
  'select-forward',
  'select-back',
  'select-find-topics',
  'select-logout',
  'select-preferences',
  'select-go-user-page',
  'select-open-url',
  'select-reset-window-size',
] as const;

type EventName = typeof EventNames[number];

export const event = {
  on: function (eventName: EventName, listener: (...args: any[]) => void) {
    eventEmitter.on(eventName, listener);
  },
  emit: function (eventName: EventName, ...args: any[]) {
    eventEmitter.emit(eventName, ...args);
  }
} as const;
