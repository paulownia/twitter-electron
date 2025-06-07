import { app } from 'electron';

export const log = {
  error: (message: any) => print(message, 'E'),
  warn: (message: any) => print(message, 'W'),
  info: getPrinter('I'),
} as const;

function getPrinter(level: string): (message: any) => void {
  if (app.isPackaged) {
    return () => {
      // In packaged mode, do nothing for info logs
    };
  } else {
    return (message: any) => print(message, level);
  }
}

function print(message: any, level: string) {
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
