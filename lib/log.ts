import { app } from 'electron';

const log = {
  error: (message: unknown) => {
    if (message instanceof Error) {
      print(`${message.name}: ${message.message}\n${message.stack}`, 'E');
    } else if (typeof message === 'string') {
      print(message, 'E');
    } else {
      print(`Unknown error: ${String(message)}`, 'E');
    }
  },
  warn: (message: string) => print(message, 'W'),
  info: getPrinter('I'),
} as const;

function getPrinter(level: string): (message: string) => void {
  if (app.isPackaged) {
    return () => {
      // In packaged mode, do nothing for info logs
    };
  } else {
    return (message: string) => print(message, level);
  }
}

function print(message: string, level: string) {
  process.stderr.write(`${level}\t${timestamp()}\t${message}\n`);
}

// Returns the current time in YYYY-MM-DD HH:MM:SS format
function timestamp(): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const now = new Date();
  const tzOffset = now.getTimezoneOffset();
  const tzSign = tzOffset <= 0 ? '+' : '-';
  const tzHour = pad(Math.floor(Math.abs(tzOffset) / 60));
  const tzMin = pad(Math.abs(tzOffset) % 60);

  const y = now.getFullYear();
  const m = pad(now.getMonth() + 1);
  const d = pad(now.getDate());
  const h = pad(now.getHours());
  const min = pad(now.getMinutes());
  const sec = pad(now.getSeconds());
  return `${y}-${m}-${d}T${h}:${min}:${sec}${tzSign}${tzHour}:${tzMin}`;
}

export default log;
