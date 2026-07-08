"use client";

import Reveal from "./Reveal";
import { useI18n } from "@/lib/i18n";

/**
 * VIDEO セクション。VIDEOS に追加するだけで埋め込まれる。
 *  - youtube:   https://www.youtube.com/watch?v=XXXX → src に "XXXX"(動画ID)
 *  - instagram: リール/投稿の URL 末尾 ID → src に "XXXX"(例: DAbCdEfGhIj)
 *
 * 例:
 *   { type: "youtube", src: "dQw4w9WgXcQ", title: "SIGNAL (Official Video)" },
 *   { type: "instagram", src: "DAbCdEfGhIj", title: "Live at ..." },
 */

type Video = {
  type: "youtube" | "instagram";
  src: string;
  title: string;
};

const VIDEOS: Video[] = [];

function Embed({ video }: { video: Video }) {
  if (video.type === "youtube") {
    return (
      <div className="aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${video.src}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
    );
  }
  return (
    <div className="mx-auto aspect-[9/16] w-full max-w-[320px]">
      <iframe
        src={`https://www.instagram.com/p/${video.src}/embed`}
        title={video.title}
        allowFullScreen
        className="h-full w-full border-0"
        loading="lazy"
      />
    </div>
  );
}

export default function Videos() {
  const { t } = useI18n();
  if (VIDEOS.length === 0) {
    return (
      <Reveal>
        <div className="relative overflow-hidden border border-line bg-surface/40 px-6 py-20 text-center sm:py-28">
          <svg
            viewBox="0 0 200 200"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-30 spin-slow"
            aria-hidden="true"
          >
            <rect x="40" y="60" width="120" height="80" stroke="var(--line)" fill="none" />
            <path d="M88 85 L118 100 L88 115 Z" stroke="var(--accent)" strokeWidth="0.8" fill="none" opacity="0.7" />
            <circle cx="100" cy="100" r="88" stroke="var(--line)" fill="none" strokeDasharray="3 7" />
          </svg>
          <p className="relative font-mono text-[10px] uppercase tracking-[0.45em] text-accent">
            {t.videos.coming}
          </p>
          <p className="relative mt-4 text-sm leading-7 text-foreground/70">
            {t.videos.note}
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {VIDEOS.map((video, i) => (
        <Reveal key={video.src} delay={i * 100}>
          <figure className="border border-line bg-surface/60 p-3">
            <Embed video={video} />
            <figcaption className="px-1 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
              {video.title}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
