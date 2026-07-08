"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * プロフィールのガンジャリアン。
 * public/artwork/ganjalien.png を宙に浮かせ、呼吸・揺らぎ・
 * 瞬きする目の光で「生きている」動きを付ける。
 */
export default function Ganjalien() {
  const [missing, setMissing] = useState(false);
  const { t } = useI18n();
  const imgRef = useRef<HTMLImageElement>(null);

  // the load error can fire before hydration — re-check on mount
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) setMissing(true);
  }, []);

  if (missing) {
    return (
      <div className="flex aspect-[3/4] w-full items-center justify-center border border-line bg-surface/40 px-6 text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted">
          ganjalien.png
          <br />
          <span className="normal-case tracking-normal">
            {t.ganja.missing}
          </span>
        </p>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[320px]">
      {/* green aura */}
      <div
        aria-hidden="true"
        className="ganja-aura absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 45%, rgba(168, 255, 62, 0.22), rgba(168, 255, 62, 0.05) 60%, transparent 75%)",
        }}
      />

      {/* levitation layer */}
      <div className="ganja-float">
        {/* breathing layer */}
        <div className="ganja-breathe relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src="/artwork/ganjalien.png"
            alt={t.ganja.alt}
            className="w-full select-none"
            draggable={false}
            onError={() => setMissing(true)}
          />
        </div>
      </div>

      {/* floating shadow */}
      <div
        aria-hidden="true"
        className="ganja-shadow mx-auto mt-2 h-3 w-2/5 rounded-[50%]"
        style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)" }}
      />
    </div>
  );
}
