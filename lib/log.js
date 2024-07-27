module.exports = exports = {
  error: (message) => print(message, 'E'),
  warn: (message) => print(message, 'W'),
};

function print(message, level) {
  process.stderr.write(`${level}\t${timestamp()}\t${message}\n`);
}

function padTimestamp(strings, ...numbers) {
  const results = [];
  for (let i = 0; i < numbers.length ; i++) {
    results.push(strings[i]);
    results.push(numbers[i].toString().padStart(2, '0'));
  }
  results.push(strings.at(-1));
  return results.join('');
}

// YYYY-MM-DD HH:MM:SS形式で現在時刻を返す
function timestamp() {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset();
  const tzSign = tzOffset <= 0 ? '+' : '-';
  const tzHour = Math.floor(Math.abs(tzOffset) / 60).toString().padStart(2, '0');
  const tzMin = (Math.abs(tzOffset) % 60).toString().padStart(2, '0');


  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const h = now.getHours();
  const min = now.getMinutes();
  const sec = now.getSeconds();
  return padTimestamp`${y}-${m}-${d}T${h}:${min}:${sec}${tzSign}${tzHour}:${tzMin}`;
}
