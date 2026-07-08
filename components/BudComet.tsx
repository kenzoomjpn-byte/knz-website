"use client";

import { useEffect, useRef } from "react";

/**
 * 約15秒に1回、大麻のバッズが流れ星のように画面を横切る。
 * Web Animations API で飛ばして終了後にDOMから削除する。
 * prefers-reduced-motion 環境では出さない。
 */

const BUD_SVG = `
<svg width="38" height="46" viewBox="0 0 40 48" fill="none" xmlns="http://www.w3.org/2000/svg"
     style="filter: drop-shadow(0 0 8px rgba(168,255,62,0.55));">
  <!-- pistils -->
  <path d="M20 5 C19 2 21 1 22 3 M14 9 C12 6 9 7 10 10 M26 8 C28 5 31 6 30 9 M9 18 C6 16 5 19 7 21 M31 17 C34 15 35 18 33 20"
        stroke="#e8a13c" stroke-width="1.3" stroke-linecap="round"/>
  <!-- main bud body -->
  <path d="M20 4 C28 9 32 18 30.5 29 C29 39 25 44 20 45.5 C15 44 11 39 9.5 29 C8 18 12 9 20 4 Z"
        fill="#33610f" stroke="#7edb2a" stroke-width="1.2"/>
  <!-- calyx bumps -->
  <path d="M20 8 C24 12 26 17 25 23 M20 8 C16 12 14 17 15 23 M20 16 C23.5 20 25 25 24 31 M20 16 C16.5 20 15 25 16 31 M20 25 C23 28 24 33 23 38 M20 25 C17 28 16 33 17 38"
        stroke="#5cb51f" stroke-width="1" stroke-linecap="round" fill="none" opacity="0.9"/>
  <!-- sugar leaf tips -->
  <path d="M10 26 C6 24 4 20 5 17 C8 19 10 22 10.5 25 Z" fill="#2c5e10" stroke="#4c9418" stroke-width="0.8"/>
  <path d="M30 26 C34 24 36 20 35 17 C32 19 30 22 29.5 25 Z" fill="#2c5e10" stroke="#4c9418" stroke-width="0.8"/>
  <path d="M13 38 C9 38 6 35 6 32 C9 33 12 35 13.5 37.5 Z" fill="#2c5e10" stroke="#4c9418" stroke-width="0.8"/>
  <path d="M27 38 C31 38 34 35 34 32 C31 33 28 35 26.5 37.5 Z" fill="#2c5e10" stroke="#4c9418" stroke-width="0.8"/>
</svg>`;

export default function BudComet() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setTimeout>;
    let disposed = false;

    const launch = () => {
      if (disposed) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const fromLeft = Math.random() < 0.5;
      const startX = fromLeft ? -100 : vw + 100;
      const endX = fromLeft ? vw + 100 : -100;
      const startY = vh * (0.05 + Math.random() * 0.55);
      const endY = startY + vh * (0.1 + Math.random() * 0.3);
      const angle = (Math.atan2(endY - startY, endX - startX) * 180) / Math.PI;
      const duration = 1400 + Math.random() * 900;

      const comet = document.createElement("div");
      comet.style.cssText =
        "position:absolute;left:0;top:0;will-change:transform;";
      comet.innerHTML = `
        <div style="position:absolute;right:22px;top:50%;width:150px;height:2px;transform:translateY(-50%);
             background:linear-gradient(to left, rgba(168,255,62,0.55), rgba(168,255,62,0.12) 60%, transparent);"></div>
        <div style="transform:translate(-50%,-50%);width:38px;height:46px;">${BUD_SVG}</div>`;
      container.appendChild(comet);

      // バッズ自体はくるくる回りながら飛ぶ
      const budEl = comet.children[1] as HTMLElement;
      budEl.animate(
        [
          { transform: "translate(-50%,-50%) rotate(0deg)" },
          { transform: "translate(-50%,-50%) rotate(360deg)" },
        ],
        { duration: 1600, iterations: Infinity }
      );

      const anim = comet.animate(
        [
          {
            transform: `translate(${startX}px, ${startY}px) rotate(${angle}deg)`,
            opacity: 0,
          },
          { opacity: 1, offset: 0.06 },
          { opacity: 1, offset: 0.88 },
          {
            transform: `translate(${endX}px, ${endY}px) rotate(${angle}deg)`,
            opacity: 0,
          },
        ],
        { duration, easing: "linear" }
      );
      anim.onfinish = () => comet.remove();

      timer = setTimeout(launch, 10000 + Math.random() * 10000); // 平均15秒
    };

    timer = setTimeout(launch, 4000 + Math.random() * 5000);

    return () => {
      disposed = true;
      clearTimeout(timer);
      container.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 overflow-hidden"
    />
  );
}
