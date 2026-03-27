# Electron バージョンアップ手順

## 1. リリースノートの確認

[Electron Releases](https://releases.electronjs.org/) で現在のバージョンから目標バージョンまでの **Breaking Changes** を確認する。特に注目すべき点：

- 廃止・変更されたAPI
- Chromium / Node.js のメジャーバージョン変更
- セキュリティポリシーの変更（CSP、WebView制約など）

このプロジェクトはWebViewを使っているため、**WebView関連の変更**には特に注意すること。

## 2. package.json の更新

```bash
npm install electron@^<新バージョン> --save-dev
```

または `package.json` の `"electron"` のバージョンを手動で書き換えてから `npm install` を実行する。

## 3. 関連パッケージの互換性確認

以下のパッケージがアップグレード後のElectronと互換性があるか確認する：

- `@electron/packager` — ビルドツール。Electronのメジャーバージョンアップ時に更新が必要な場合がある
- `electron-context-menu` — Electron APIの変更に影響を受ける可能性がある

## 4. TypeScript型定義の確認

Electronの型定義はパッケージに同梱されているため別途更新は不要だが、型エラーが出た場合はAPIの変更に合わせてコードを修正する。

## 5. ビルド・テストの実行

```bash
# コンパイル確認
npx tsc

# テスト実行
npm test

# 開発モードで動作確認
npm start

# ビルド確認
npm run build:no-sign
```

## 6. 動作確認のポイント

このプロジェクト固有の確認項目：

- X(Twitter)のWebViewが正常に表示されるか
- コンテキストメニューが動作するか
- リンクの外部ブラウザ開放（`open`パッケージ経由）が動くか
- macOS固有の機能（メニューバー、Dockなど）が正常か

## 7. メジャーバージョンを複数跨ぐ場合

例えば v38 → v41 のように複数メジャーバージョンを跨ぐ場合は、**1メジャーずつ段階的にアップグレード**する方が、Breaking Changesの影響を特定しやすい。
