exports.error = (message) => print(message, 'E');

exports.warn = (message) => print(message, 'W');

function print(message, level) {
  process.stderr.write(`${level}\t${timestamp()}\t${message}\n`);
}

// YYYY-MM-DD HH:MM:SS形式で現在時刻を返す
function timestamp() {
  const now = new Date();
  const y = now.getFullYear();
  const m = (now.getMonth() + 1).toString().padStart(2, '0');
  const d = now.getDate().toString().padStart(2, '0');
  const h = now.getHours().toString().padStart(2, '0');
  const min = now.getMinutes().toString().padStart(2, '0');
  const s = now.getSeconds().toString().padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}
