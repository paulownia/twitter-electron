# ロギング

メインプロセス内では`lib/log.ts`のロガーを使用する。

## 初期化

`initLogger(app)`で初期化する（`main.ts`で実行済み）

## 使用方法

`getLogger()`でロガーインスタンスを取得して使用する。

```typescript
import { getLogger } from './lib/log.js';

const log = getLogger();
log.error('エラーメッセージ');
log.warn('警告メッセージ');
log.info('情報メッセージ'); // 開発モードのみ出力
```

## 仕様

- **出力先**: `process.stderr`
- **フォーマット**: `{レベル}\t{ISO 8601タイムスタンプ}\t{メッセージ}\n`
- **ログレベル**:
  - `error`: エラー情報（Errorオブジェクト、文字列、その他）
  - `warn`: 警告情報
  - `info`: 情報（開発モード`isPackaged: false`のみ）
