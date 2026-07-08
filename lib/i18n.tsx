"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "ja" | "en";

const ja = {
  sub: {
    listen: "楽曲試聴",
    releases: "リリース",
    goods: "グッズ",
    video: "ショート / アニメーション",
    profile: "プロフィール",
    fans: "メルマガ登録",
    contact: "コンタクト",
  },
  listen: { synced: "* SoundCloudの新曲が自動で反映されます" },
  releases: { open: "試聴・購入" },
  goods: { coming: "Coming soon", note: "グッズ、準備中。購入はBandcampにて。" },
  videos: { coming: "Transmission incoming", note: "ショート / アニメーション、準備中。" },
  release: {
    back: "トップへ戻る",
    preview: "試聴 — SoundCloud",
    buy: "購入 — Digital",
    bandcampCta: "Buy on Bandcamp",
    bandcampNote:
      "購入・決済はBandcampで行われます。購入後はWAV / MP3 / AIFF / FLACなど好きな形式でダウンロードできます。",
  },
  profile: {
    heading: "KNZ — 宇宙音楽実験家 / Dance Music Producer",
    p1: "日本を拠点に活動する宇宙音楽実験家。Nature × Machine ∞ Universe——自然の有機的なパターン、機械の反復運動、そして宇宙の秩序を表現している。",
    p2: "世界中の麻文化復興を宇宙規模で推進するガンジャリアン(GANJA x ALIEN)。すべての物質に魂が宿っている。この宇宙空間に緑の光を注ぐ壮大なプロジェクトを実行中。",
    p3: "地球という狭い世界が真に平和に満ち溢れた時、私はシンセミアとなる。",
    tools: "脳/手/口/目/足/PC/地球",
  },
  fans: {
    pitchA: "登録すると、KNZの",
    unreleased: "未発表曲",
    pitchB: "や",
    newVideos: "新作映像",
    pitchC: "をどこよりも早く受け取れます。緑の光の最前列へ。",
    lastPh: "姓",
    firstPh: "名",
    locPh: "Tokyo, Japan",
    join: "Join",
    joining: "Joining…",
    error: "登録に失敗しました。時間をおいて再度お試しください。",
    privacy: "登録情報は先行配信の連絡のみに使用します。",
    successTitle: "Welcome to the orbit",
    successBody: "登録ありがとうございます。未発表曲・映像の先行アクセスをメールでお届けします。",
  },
  contact: {
    namePh: "お名前",
    msgPh: "ブッキング・リミックス等のご依頼、その他お問い合わせ",
    send: "Send",
    sending: "Sending…",
    error: "送信に失敗しました。時間をおいて再度お試しください。",
    successTitle: "Transmission received",
    successBody: "お問い合わせありがとうございます。内容を確認のうえ返信します。",
  },
  voice: {
    prompt: "合言葉をどうぞ…",
    heard: "認識: ",
    manual: "このブラウザは音声入力に非対応。合言葉を入力:",
    close: "閉じる",
  },
  ganja: {
    alt: "GANJA x ALIEN — ガンジャリアン",
    missing: "画像を public/artwork/ に配置してください",
  },
};

type Dict = typeof ja;

const en: Dict = {
  sub: {
    listen: "Music Preview",
    releases: "Releases",
    goods: "Merch",
    video: "Shorts / Animation",
    profile: "Profile",
    fans: "Newsletter",
    contact: "Contact",
  },
  listen: { synced: "* New tracks sync automatically from SoundCloud" },
  releases: { open: "Listen & Buy" },
  goods: { coming: "Coming soon", note: "Merch in preparation — available on Bandcamp." },
  videos: { coming: "Transmission incoming", note: "Shorts / animations — coming soon." },
  release: {
    back: "Back to top",
    preview: "Preview — SoundCloud",
    buy: "Buy — Digital",
    bandcampCta: "Buy on Bandcamp",
    bandcampNote:
      "Checkout happens on Bandcamp. After purchase you can download in any format — WAV / MP3 / AIFF / FLAC and more.",
  },
  profile: {
    heading: "KNZ — Cosmic Sound Experimenter / Dance Music Producer",
    p1: "A cosmic sound experimenter based in Japan. Nature × Machine ∞ Universe — expressing the organic patterns of nature, the repetition of machines, and the order of the cosmos.",
    p2: "A GANJARIAN (GANJA x ALIEN) advancing the revival of hemp culture worldwide, on a cosmic scale. A soul dwells in all matter. A grand project to pour green light into this universe is underway.",
    p3: "When this narrow world called Earth is truly filled with peace, I will become sinsemilla.",
    tools: "Brain / Hands / Mouth / Eyes / Feet / PC / Earth",
  },
  fans: {
    pitchA: "Join to receive KNZ's ",
    unreleased: "unreleased tracks",
    pitchB: " and ",
    newVideos: "new videos",
    pitchC: " before anyone else. Front row of the green light.",
    lastPh: "Last name",
    firstPh: "First name",
    locPh: "Tokyo, Japan",
    join: "Join",
    joining: "Joining…",
    error: "Something went wrong. Please try again later.",
    privacy: "Your info is used only for early-access updates.",
    successTitle: "Welcome to the orbit",
    successBody: "Thank you for joining. Early access to unreleased tracks and videos will arrive by email.",
  },
  contact: {
    namePh: "Your name",
    msgPh: "Booking / remix requests, or anything else",
    send: "Send",
    sending: "Sending…",
    error: "Something went wrong. Please try again later.",
    successTitle: "Transmission received",
    successBody: "Thanks for reaching out. I'll get back to you soon.",
  },
  voice: {
    prompt: "Say the passphrase…",
    heard: "Heard: ",
    manual: "Voice input is not supported in this browser. Type the passphrase:",
    close: "Close",
  },
  ganja: {
    alt: "GANJA x ALIEN — Ganjarian",
    missing: "Place the image in public/artwork/",
  },
};

const I18nContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}>({ lang: "ja", setLang: () => {}, t: ja });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ja");

  // 保存済み言語の復元は SSR 後の初回マウントでしか行えない
  useEffect(() => {
    const saved = window.localStorage.getItem("knz-lang");
    if (saved === "ja" || saved === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLangState(saved);
    } else if (!navigator.language.toLowerCase().startsWith("ja")) {
      setLangState("en");
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("knz-lang", l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: lang === "ja" ? ja : en }}>
      {children}
    </I18nContext.Provider>
  );
}

export const useI18n = () => useContext(I18nContext);
