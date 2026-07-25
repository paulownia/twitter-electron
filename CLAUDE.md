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

- [ディレクトリ構成](docs/directory-structure.md) - ファイル追加時に更新が必要
- [コーディング規約](docs/coding-standards.md) - 命名規則、コメント、スタイル
- [テストガイド](docs/testing-guide.md) - テストの書き方
- [ロギング](docs/logging.md) - ロガーの使用方法


## TODO / Issuesドキュメント

spec/issuesディレクトリ以下に課題ごとに.mdファイルを作成する。

各課題に対する対応プランはspec/plansディレクトリ以下に設置、issuesと同一のファイル名で.mdファイルを作成する。

