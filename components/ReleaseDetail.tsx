"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { useI18n } from "@/lib/i18n";
import type { Release } from "@/lib/releases";

const scEmbed = (url: string) =>
  "https://w.soundcloud.com/player/?url=" +
  encodeURIComponent(url) +
  "&color=%23a8ff3e&auto_play=false&hide_related=true&show_comments=false" +
  "&show_user=true&show_reposts=false&show_teaser=false&visual=false";

export default function ReleaseDetail({ release }: { release: Release }) {
  const { lang, t } = useI18n();

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-28 sm:px-8">
      <Link
        href="/#releases"
        className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-accent"
      >
        ← {t.release.back}
      </Link>

      <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,380px)_1fr] md:gap-16">
        {/* artwork */}
        <Reveal>
          <div className="border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={release.artwork}
              alt={`${release.title} — ${release.artist}`}
              className="aspect-square w-full object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={120}>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {release.year} — {release.format}
          </p>
          <h1 className="mt-3 text-3xl font-light tracking-[0.15em] sm:text-4xl">
            {release.title}
          </h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-muted">
            {release.artist}
          </p>

          <p className="mt-8 text-sm leading-8 text-foreground/85">
            {release.description[lang]}
          </p>

          {/* soundcloud preview */}
          <div className="mt-10">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              {t.release.preview}
            </p>
            <div className="border border-line">
              <iframe
                title={`${release.title} — SoundCloud`}
                src={scEmbed(release.soundcloudEmbed)}
                height={166}
                allow="autoplay; encrypted-media"
                className="block w-full border-0"
                loading="lazy"
              />
            </div>
          </div>

          {/* purchase — Bandcamp */}
          <div className="mt-10 border-t border-line pt-8">
            <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
              {t.release.buy}
            </p>
            <a
              href={release.bandcampUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 border border-accent-dim px-8 py-4 font-mono text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              {/* bandcamp mark */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M0 18.75 7.44 5.25H24l-7.44 13.5H0Z" />
              </svg>
              {t.release.bandcampCta} ↗
            </a>
            <p className="mt-4 font-mono text-[10px] leading-5 tracking-[0.1em] text-muted/70">
              {t.release.bandcampNote}
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
