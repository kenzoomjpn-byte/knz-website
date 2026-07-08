# KNZ — Official Website

宇宙音楽実験家 KNZ のオフィシャルサイト。
Nature × Machine ∞ Universe — sacred geometry、麻の葉文様、アシッドグリーンの世界観。

Next.js (App Router) / TypeScript / Tailwind CSS v4

## 開発

```bash
npm install
npm run dev    # http://localhost:3000
npm run build  # 本番ビルド
npm run lint
```

## 環境変数(.env.local / ホスティング側に設定)

| 変数 | 用途 |
|---|---|
| `CONTACT_FORWARD_EMAIL` | 問い合わせ・FANS登録の通知メール転送先 |
| `SHEETS_WEBHOOK_URL` | FANS登録をGoogleスプレッドシートに追記するApps Script URL(セットアップ手順: `docs/sheets-webhook.gs`) |

## コンテンツの更新方法

| 更新したいもの | 場所 |
|---|---|
| LISTEN の楽曲 | 更新不要。SoundCloud に公開すると自動反映 |
| リリース(試聴・購入ページ) | `lib/releases.ts` に1件追加。アートワークは `public/artwork/` へ。SoundCloud埋め込みIDは `https://soundcloud.com/oembed?format=json&url=<トラックURL>` で取得 |
| グッズ | `components/Goods.tsx` の `GOODS` 配列。商品写真は `public/goods/`、リンク先はBandcampの商品ページ |
| 動画 | `components/Videos.tsx` の `VIDEOS` 配列(YouTube ID / InstagramリールID) |
| 文言(日英) | `lib/i18n.tsx` の辞書 |
| プロフィール | `app/page.tsx` の PROFILE セクション |

## デプロイ(Vercel)

1. GitHubにリポジトリを作成してプッシュ
2. [vercel.com](https://vercel.com) にGitHubでログイン → Import Project → このリポジトリを選択
3. Environment Variables に上記2つを設定
4. Deploy — 以降は `git push` だけで自動デプロイ

## メモ

- 問い合わせ/FANS通知は [FormSubmit](https://formsubmit.co) 経由(転送先メールで有効化済み)
- 音源マスターは `audio-masters/`(git管理外)。サイトからの試聴はすべてSoundCloud埋め込み
- 隠し機能: トップのK/N/Zの文字をクリック → 音声認証「ケンズーム」
