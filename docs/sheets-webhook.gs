/**
 * KNZ FANS 登録 → Google スプレッドシート連携用 Apps Script
 *
 * ■ セットアップ手順(3分)
 * 1. https://sheets.new で新しいスプレッドシートを作成(名前例: KNZ FANS)
 *    1行目に見出し: registeredAt | lastName | firstName | email | location
 * 2. メニュー「拡張機能」→「Apps Script」を開き、このファイルの中身を貼り付けて保存
 * 3. 「デプロイ」→「新しいデプロイ」→ 種類「ウェブアプリ」
 *      - 次のユーザーとして実行: 自分
 *      - アクセスできるユーザー: 全員
 *    → デプロイして表示された「ウェブアプリのURL」をコピー
 * 4. knz-website/.env.local に1行追加:
 *      SHEETS_WEBHOOK_URL=コピーしたURL
 *    (本番公開時はホスティング側の環境変数にも同じものを設定)
 *
 * 以降、サイトのFANSフォームからの登録が自動でシートに1行ずつ追加されます。
 */

function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  sheet.appendRow([
    data.registeredAt || new Date().toISOString(),
    data.lastName || "",
    data.firstName || "",
    data.email || "",
    data.location || "",
  ]);
  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
