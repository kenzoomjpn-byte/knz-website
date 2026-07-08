"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { RELEASES } from "@/lib/releases";
import { useI18n } from "@/lib/i18n";

export default function Releases() {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {RELEASES.map((release, i) => (
        <Reveal key={release.slug} delay={i * 100}>
          <Link href={`/releases/${release.slug}`} className="group block">
            <div className="relative aspect-square overflow-hidden border border-line transition-colors duration-500 group-hover:border-accent-dim">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={release.artwork}
                alt={`${release.title} — ${release.artist}`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {t.releases.open}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-sm font-medium tracking-wide sm:text-base">
                {release.title}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {release.year} — {release.artist}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/60">
                {release.format}
              </p>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
