"use client";

import Reveal from "./Reveal";
import { useI18n } from "@/lib/i18n";

/**
 * GOODS — Bandcamp のマーチページへ流す物販グリッド。
 * GOODS 配列に1件追加するだけでカードが増える。
 *  image: public/goods/ に置いた商品写真のパス
 *  bandcampUrl: Bandcamp の該当マーチページ URL
 */

type GoodsItem = {
  id: string;
  name: string;
  tag: string; // 例: "T-SHIRT / ¥4,500"
  image: string;
  bandcampUrl: string;
};

const GOODS: GoodsItem[] = [];

export default function Goods() {
  const { t } = useI18n();

  if (GOODS.length === 0) {
    return (
      <Reveal>
        <div className="relative overflow-hidden border border-line bg-surface/40 px-6 py-20 text-center sm:py-28">
          {/* line-art tee ornament */}
          <svg
            viewBox="0 0 200 200"
            className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-30"
            aria-hidden="true"
          >
            <path
              d="M78 52 L100 62 L122 52 L152 66 L142 92 L126 86 L126 150 L74 150 L74 86 L58 92 L48 66 Z"
              stroke="var(--line)"
              fill="none"
            />
            <path
              d="M88 100 C96 92 104 92 112 100 M85 112 h30 M88 124 h24"
              stroke="var(--accent)"
              strokeWidth="0.8"
              fill="none"
              opacity="0.5"
            />
            <circle cx="100" cy="100" r="88" stroke="var(--line)" fill="none" strokeDasharray="3 7" className="spin-slower" />
          </svg>
          <p className="relative font-mono text-[10px] uppercase tracking-[0.45em] text-accent">
            {t.goods.coming}
          </p>
          <p className="relative mt-4 text-sm leading-7 text-foreground/70">
            {t.goods.note}
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
      {GOODS.map((item, i) => (
        <Reveal key={item.id} delay={i * 100}>
          <a
            href={item.bandcampUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="relative aspect-square overflow-hidden border border-line transition-colors duration-500 group-hover:border-accent-dim">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-background/80 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="pb-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                  {t.release.bandcampCta} ↗
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <h3 className="text-sm font-medium tracking-wide sm:text-base">
                {item.name}
              </h3>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
                {item.tag}
              </p>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
