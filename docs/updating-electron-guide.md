# Electron バージョンアップ手順

## 1. 変更点の調査

[Electron Releases](https://releases.electronjs.org/)と公式ドキュメントで、現在のバージョンから目標バージョンまでのBreaking Changesを確認する。特に次の変更は、このアプリへの影響を調査する。

- `WebView`と`webPreferences`の仕様・セキュリティ要件
- ウィンドウ、セッション、ナビゲーション関連API
- ChromiumおよびNode.jsの更新によるWeb版Xへの影響
- macOSのサポート対象バージョンと署名・パッケージング要件

## 2. 依存関係の更新

```bash
npm install electron@^<新バージョン> --save-dev
```

`@electron/packager`と`electron-context-menu`についても、目標バージョンとの互換性を確認する。依存関係を更新した理由と、調査で見つかった影響を変更内容に記録する。

## 3. 自動検証

```bash
npx tsc
npm test
npm run build:no-sign
```

## 4. 手動確認

`npm start`で起動し、少なくとも次を確認する。

- XのWebViewが正常に表示されるか
- コンテキストメニューが動作するか
- リンクが外部ブラウザで開くか
- ログイン状態やCookieが起動後も維持されるか
- 設定画面とプロンプト画面が動作するか
- メニューバー、キーボードショートカット、DockなどのmacOS固有機能が動作するか

署名付きビルドはApple Developer ID証明書が必要なため、AI Agentではなくユーザが実行する。

## 5. 複数メジャーバージョンを跨ぐ場合

必ず一律に1メジャーずつ更新するのではなく、Breaking Changesと互換性を先に調査する。問題の切り分けが難しい場合に限り、中間バージョンでの検証を行う。
