# テストガイド

ユニットテストを実装し、コードの品質を保つ。

## 基本情報

- **フレームワーク**: `node:test`, `node:assert`を使用
- **アサーションライブラリ**: `@power-assert/node`を使用
  - テスト失敗時に詳細な評価過程が表示される
  - `# AI-readable format`により、AIがエラー内容を理解しやすい
- **テストファイル配置**: `test/**/*.test.ts`
- **モック**: `node:test`の`mock.method()`を使用
  - 例: `t.mock.method(process.stderr, 'write', mockFn)`

## テスト実行

```bash
npm test                          # 全テスト実行
npm test -- test/lib/log.test.ts  # 特定のテストのみ実行
```

## テストの書き方例

```typescript
import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('myModule', () => {
  it('should do something', (t) => {
    const output: string[] = [];
    t.mock.method(process.stderr, 'write', (chunk: string) => {
      output.push(chunk);
      return true;
    });

    // テスト実行
    myFunction();

    // 検証
    assert.strictEqual(output.length, 1);
    assert.match(output[0], /expected pattern/);
  });
});
```
