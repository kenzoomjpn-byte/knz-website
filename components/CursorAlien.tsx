"use client";

import { useEffect, useRef } from "react";

/**
 * カーソルを追いかけて宇宙空間を浮遊するエイリアン。
 * スプリング補間で遅れて追従し、常時ゆらゆらと上下に漂う。
 * マウスのないデバイスと prefers-reduced-motion 環境では出さない。
 */
export default function CursorAlien() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let x = tx;
    let y = ty;
    let vx = 0;
    let raf = 0;
    let seen = false;

    const onMove = (e: MouseEvent) => {
      // hover slightly above and to the right of the cursor
      tx = e.clientX + 30;
      ty = e.clientY - 36;
      if (!seen) {
        seen = true;
        x = tx;
        y = ty;
        el.style.transform = `translate(${x}px, ${y}px)`;
        el.style.opacity = "1";
      }
    };

    const loop = (t: number) => {
      const nx = x + (tx - x) * 0.055;
      vx = nx - x;
      x = nx;
      y += (ty - y) * 0.055;
      const bob = Math.sin(t * 0.0016) * 5;
      const tilt =
        Math.max(-0.45, Math.min(0.45, vx * 0.04)) + Math.sin(t * 0.0011) * 0.08;
      el.style.transform = `translate(${x}px, ${y + bob}px) rotate(${tilt}rad)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-40 opacity-0 transition-opacity duration-700"
      style={{ willChange: "transform" }}
    >
      <svg
        width="42"
        height="42"
        viewBox="0 0 48 48"
        className="-translate-x-1/2 -translate-y-1/2"
        style={{ filter: "drop-shadow(0 0 10px rgba(168, 255, 62, 0.35))" }}
      >
        {/* antenna */}
        <line x1="24" y1="7" x2="24" y2="3" stroke="var(--accent)" strokeWidth="1.2" />
        <circle cx="24" cy="2.2" r="1.6" fill="var(--accent)" className="pulse-glow" />
        {/* head: wide cranium, narrow chin */}
        <path
          d="M24 7 C34 7 40.5 13.5 40.5 21 C40.5 30 32.5 40.5 24 43 C15.5 40.5 7.5 30 7.5 21 C7.5 13.5 14 7 24 7 Z"
          fill="var(--surface)"
          stroke="var(--accent)"
          strokeWidth="1.3"
        />
        {/* glowing almond eyes */}
        <path
          d="M13.5 19.5 C16.5 16.5 21 17.5 22 22 C19.5 25.5 14.5 24 13.5 19.5 Z"
          fill="var(--accent)"
        />
        <path
          d="M34.5 19.5 C31.5 16.5 27 17.5 26 22 C28.5 25.5 33.5 24 34.5 19.5 Z"
          fill="var(--accent)"
        />
        {/* tiny mouth */}
        <path
          d="M21.5 32 Q24 34 26.5 32"
          stroke="var(--accent)"
          strokeWidth="1"
          fill="none"
          opacity="0.7"
        />
      </svg>
    </div>
  );
}
