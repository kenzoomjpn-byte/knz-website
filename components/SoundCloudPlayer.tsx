"use client";

import { useI18n } from "@/lib/i18n";

/**
 * LISTEN — SoundCloud 連動プレイヤー。
 * プロフィール全体を埋め込んでいるので、SoundCloud に公開した曲は
 * 自動でここに反映される。高さ≒5曲分、それ以降はウィジェット内でスクロール。
 */

// 表示用リンクは人が読むURL、埋め込み再生には内部ID(users/93080684)を使う
const SC_PROFILE = "https://soundcloud.com/knzooooooooom";
const SC_RESOLVE = "https://api.soundcloud.com/users/93080684";

const SC_EMBED =
  "https://w.soundcloud.com/player/?url=" +
  encodeURIComponent(SC_RESOLVE) +
  "&color=%23a8ff3e&auto_play=false&hide_related=true&show_comments=false" +
  "&show_user=true&show_reposts=false&show_teaser=false&visual=false&show_artwork=true";

export default function SoundCloudPlayer() {
  const { t } = useI18n();
  return (
    <div className="border border-line bg-surface/60">
      {/* およそ5トラック分の高さ。以降はウィジェット内スクロール */}
      <iframe
        title="KNZ on SoundCloud"
        src={SC_EMBED}
        height={460}
        allow="autoplay; encrypted-media"
        className="block w-full border-0"
        loading="lazy"
      />
      <div className="flex items-center justify-between border-t border-line px-5 py-3 sm:px-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
          {t.listen.synced}
        </p>
        <a
          href={SC_PROFILE}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted transition-colors hover:text-accent"
        >
          SoundCloud ↗
        </a>
      </div>
    </div>
  );
}
