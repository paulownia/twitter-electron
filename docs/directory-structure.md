# ディレクトリ構成

ファイルを追加した時は以下のツリーも更新してください。

```
twitter-electron/
├── build/                           # ビルド成果物
├── dist/                            # TypeScriptコンパイル済みJavaScript
├── icon/                            # アプリケーションアイコン
│   ├── AppIcon.icns                # macOS用アイコン
│   └── AppIcon.iconset/            # アイコンセット
├── lib/                             # TypeScriptソースコード (メインプロセス)
│   ├── log.ts                      # ロガー
│   └── views/                      # 各ビューの実装
├── preload/                         # プリロードスクリプト
├── test/                            # テストコード
│   └── lib/                        # libディレクトリのテスト
│       ├── bounds.test.ts          # bounds.tsのテスト
│       ├── log.test.ts             # log.tsのテスト
│       └── user-id.test.ts         # user-id.tsのテスト
├── ui/                              # レンダラープロセス用UI
│   ├── preference.html             # 設定画面HTML
│   ├── preference.js               # 設定画面JavaScript
│   ├── prompt.html                 # プロンプト画面HTML
│   └── prompt.js                   # プロンプト画面JavaScript
├── tauri-app/                       # Tauri v2版 (移行先)
│   ├── src/                        # フロントエンド (WebView用HTML/JS)
│   │   ├── index.html             # プレースホルダー
│   │   ├── lib/                   # 再利用ビジネスロジック
│   │   ├── preference.html        # 設定画面HTML
│   │   ├── preference.js          # 設定画面JavaScript
│   │   ├── prompt.html            # プロンプト画面HTML
│   │   └── prompt.js              # プロンプト画面JavaScript
│   ├── src-tauri/                  # Rustバックエンド
│   │   ├── src/
│   │   │   ├── main.rs           # エントリポイント
│   │   │   ├── lib.rs            # アプリ起動・WebView設定
│   │   │   ├── config.rs         # 設定ファイルI/O
│   │   │   ├── menu.rs           # メニュー構築・イベント処理
│   │   │   ├── dialog.rs         # ダイアログウィンドウ管理
│   │   │   └── clipboard.rs      # クリップボード操作
│   │   ├── capabilities/          # Tauri権限設定
│   │   ├── icons/                 # アプリアイコン
│   │   ├── Cargo.toml            # Rust依存関係
│   │   └── tauri.conf.json       # Tauri設定
│   ├── test/                      # テストコード
│   ├── package.json               # npm設定
│   └── tsconfig.json              # TypeScript設定
├── build.js                         # ビルドスクリプト
├── CLAUDE.md                        # プロジェクト情報
├── eslint.config.js                 # ESLint設定
├── main.ts                          # メインプロセス エントリポイント
├── package.json                     # npm設定
└── tsconfig.json                    # TypeScript設定
```
