interface Logger {
  error: (message: unknown) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}

const log: Logger = {
  error: (_message: unknown) => {},
  warn: (_message: string) => {},
  info: (_message: string) => {},
};

function print(message: string, level: string) {
  process.stderr.write(`${level}\t${timestamp()}\t${message}\n`);
}

export function getLogger(): Logger {
  return log;
}

export function initLogger(app: { isPackaged: boolean }): void {
  if (Object.isFrozen(log)) {
    log.warn('Logger already initialized');
    return;
  }
  log.error = (message: unknown) => {
    if (message instanceof Error) {
      print(`${message.name}: ${message.message}\n${message.stack}`, 'E');
    } else if (typeof message === 'string') {
      print(message, 'E');
    } else {
      print(`Unknown error: ${String(message)}`, 'E');
    }
  };
  log.warn = (message: string) => print(message, 'W');
  // packagedでない（＝開発中）場合のみ info ログを出す
  if (!app.isPackaged) {
    log.info = (message: string) => print(message, 'I');
  }
  // 以後 log オブジェクトのプロパティは変更不可にする
  Object.freeze(log);
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
