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

## Electron 45への更新（2026-10-22）

- eMudhraの侵害された中間証明書をChromiumとNode.jsの両方でブロックするため、Electronを41.10.3から45.0.0へ更新した。
  - [公式セキュリティ情報](https://github.com/electron/electron/security/advisories/GHSA-jr5w-w6x2-84p9)
- Electron 44以降の非同期クリップボードAPIに対応し、読み取り完了後に入力画面を開き、読み書きの失敗をログに記録する。
- 同APIに対応する`electron-context-menu` 5.1.0へ更新した。`menu`によるカスタマイズは引き続き利用できる。
- `@electron/packager`は19.1.0を維持する。パッケージ生成の実行確認は下記のアイコン生成エラーにより未完了。
- macOS 12のサポート終了により、動作要件はmacOS 13以降になる。
- sandbox付きpreloadで削除されたNode.jsモジュール・グローバルは使用していない。子ウィンドウは外部ブラウザへ転送しており、`window.open()`のプロセス分離変更への対応は不要。
- Electron 42以降ではバイナリ取得が初回起動時になるため、npmパッケージのインストール成功だけでは起動確認済みとはいえない。

検証結果:

- 型チェック、全7テスト、変更したTypeScriptファイルのLint、`git diff --check`は成功。
- 全体Lintは`.tsimp/compiled`の生成コードで失敗。
- `npm run build:no-sign`は`iconutil`の`Invalid Iconset`で停止。ビルドとGUIの手動確認は未完了。
