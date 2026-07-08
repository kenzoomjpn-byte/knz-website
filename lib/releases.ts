/**
 * リリース一覧。1件追加すると:
 *  - トップの RELEASES グリッドにアートワークカードが増える
 *  - /releases/[slug] の試聴・購入ページが自動生成される
 *
 * soundcloudUrl は人が読む用のトラックURL(「SoundCloudで開く」用)。
 * soundcloudEmbed は埋め込み再生に使う内部ID形式のURL。
 * 内部IDは https://soundcloud.com/oembed?format=json&url=<トラックURL> の
 * レスポンス html 内 api.soundcloud.com/tracks/XXXX から取得できる。
 * bandcampUrl は購入ページ。トラック公開後は
 * https://knzooooooooom.bandcamp.com/track/... に差し替える。
 */

export type Release = {
  slug: string;
  title: string;
  artist: string;
  year: string;
  format: string;
  artwork: string; // public/ 配下のパス
  soundcloudUrl: string;
  soundcloudEmbed: string; // api.soundcloud.com/tracks/XXXX
  bandcampUrl: string;
  description: { ja: string; en: string };
};

export const RELEASES: Release[] = [
  {
    slug: "signal",
    title: "SIGNAL",
    artist: "KNZ x ZNK",
    year: "2026",
    format: "Digital Single",
    artwork: "/artwork/signal-cover.svg",
    soundcloudUrl:
      "https://soundcloud.com/knzooooooooom/knz-x-znk-signal-original-mix",
    soundcloudEmbed: "https://api.soundcloud.com/tracks/2304189884",
    bandcampUrl: "https://knzooooooooom.bandcamp.com/",
    description: {
      ja: "KNZ x ZNK による1stシングル。宇宙空間へ発信される最初の信号——アシッドなグルーヴと有機的なノイズが交差する5分27秒。地球と宇宙の間で踊るためのアンダーグラウンド・ビート。",
      en: "The debut single by KNZ x ZNK. The first signal transmitted into space — 5 minutes 27 seconds where acid grooves cross organic noise. Underground beats for dancing between the Earth and the cosmos.",
    },
  },
];

export const findRelease = (slug: string) =>
  RELEASES.find((r) => r.slug === slug);
