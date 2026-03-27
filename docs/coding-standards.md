# コーディング規約

## 命名規則

TypeScript/JavaScriptの一般的な命名規則に従う。

- **変数名、関数名、メソッド名**: キャメルケース
  - 例: `myVariable`, `calculateSum`, `getUserId`
- **クラス名、インターフェース名**: パスカルケース
  - 例: `MyClass`, `Logger`, `BrowserWindow`
- 全て大文字で表記される頭字語（例: `ID`, `URL`, `HTML`）は、すべて小文字の単語として扱う。
  - 例、変数名の場合
    - `userId`, `htmlContent`, `urlPattern`
    - NG: `userID`, `HTMLContent`, `URLPattern`
  - 例、クラス名の場合
    - `UserId`, `HtmlParser`, `UrlValidator`
    - NG: `UserID`, `HTMLParser`, `URLValidator`
  - これは頭字語が連続した場合に単語の区切りを明確にするため。
    - 例: `getHtmlUrl()` vs `getHTMLURL()`（NG）

## コメント

- 重要なロジックにはコメントを追加すること。
- whyをコメントで説明すること。
- howは基本的に不要、ただし複雑な場合は補助のためhowを追加する。

## コード整形

- ESLint Stylisticを使用してコードを整形する
- Prettierは使用しない。

以下のコマンドでeslintが実行される。コードを書いた後に実行してコードを整形すること。

```bash
npm run format
```

## コーディングスタイル

- 関数の長さは20行以内が理想。しかし設定値などが列挙されるため行数が増えた場合は許容する。その場合でもロジックは20行以内に収めること。設定値やデフォルト値で行数が増える場合は、設定値やデフォルト値を定数や別ファイルに切り出すことを検討する。
- 非同期処理は可能な限り async/await を使用する
