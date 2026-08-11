# このプロジェクトについて

X(旧Twitter)のWeb版ページをElectronのWebViewで表示するmacOS用クライアントアプリです。

## 技術スタック

- Electron
- TypeScript
- Node.js

バージョンは`package.json`を参照してください。

## 開発コマンド

```bash
# 開発中の実行（ビルド済みアプリが起動中だと正常に起動しない）
npm start

# テスト
npm test                          # 全テスト実行
npm test -- test/lib/log.test.ts  # 特定のテストのみ実行

# コード整形（ESLint Stylistic）
npm run format

# ビルド
npm run build:no-sign  # ローカル動作確認用（署名なし）
npm run build:sign     # リリース用（署名あり）
```

signedビルドにはKeychainに登録したApple Developer IDの証明書が必要であるため、AI Agentは実行できません。signedビルドが必要な場合はユーザに実行を促してください。

## 詳細ドキュメント

- [コーディング規約](docs/coding-standards.md) - プロジェクト固有の命名規則とコメント方針
- [Electronバージョンアップ手順](docs/updating-electron-guide.md) - 更新時の確認事項

## 実装上の規約

- メインプロセスのログ出力には`lib/log.ts`の`getLogger()`を使用する。
- テストには`node:test`、`node:assert`、`@power-assert/node`を使用し、`test/**/*.test.ts`に配置する。
- モックには原則として`node:test`の`mock.method()`を使用する。


## TODO / Issuesドキュメント

spec/issuesディレクトリ以下に課題ごとに.mdファイルを作成する。

各課題に対する対応プランはspec/plansディレクトリ以下に設置、issuesと同一のファイル名で.mdファイルを作成する。
