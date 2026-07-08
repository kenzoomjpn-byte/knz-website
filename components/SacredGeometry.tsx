"use client";

import { useEffect, useRef } from "react";

/**
 * Full-screen canvas animation:
 * asanoha (麻の葉) lattice + rotating nested polygons + drifting node
 * particles connected by hairlines, with the K/N/Z letters orbiting in
 * lockstep with the hexagram triangles. The tagline words each ride their
 * own inclined orbit like debris in space — shrinking and dimming on the
 * far side, passing behind the letters. Frames fade instead of clearing,
 * and each letter drags chromatic ghost echoes — psychedelic afterimages.
 */
export default function SacredGeometry() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let raf = 0;

    const ACCENT = "168, 255, 62"; // rgb of --accent (acid green)
    const FAINT = "150, 220, 90";

    type Node = { a: number; r: number; speed: number; wobble: number };
    let nodes: Node[] = [];

    // tagline words drifting on their own inclined orbits
    const WORD_TEXTS = [
      "NATURE",
      "×",
      "MACHINE",
      "∞",
      "UNIVERSE",
      "宇宙音楽実験家",
      "DANCE",
      "MUSIC",
      "PRODUCER",
    ];
    type WordOrbit = {
      text: string;
      rad: number; // fraction of the max orbit radius
      flat: number; // apparent ellipse flattening = cos(inclination)
      tilt: number; // rotation of the orbit plane on screen
      speed: number;
      phase: number;
      bob: number;
    };
    const words: WordOrbit[] = WORD_TEXTS.map((text) => ({
      text,
      rad: 0.55 + Math.random() * 0.45,
      flat: 0.28 + Math.random() * 0.38,
      tilt: Math.random() * Math.PI,
      speed: (0.00003 + Math.random() * 0.00005) * (Math.random() < 0.5 ? -1 : 1),
      phase: Math.random() * Math.PI * 2,
      bob: Math.random() * Math.PI * 2,
    }));
    const monoFont =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--font-mono-face")
        .trim() || "ui-monospace";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const initNodes = () => {
      const count = width < 640 ? 14 : 24;
      nodes = Array.from({ length: count }, (_, i) => ({
        a: (Math.PI * 2 * i) / count + Math.random() * 0.5,
        r: (0.18 + Math.random() * 0.42) * Math.max(width, height) * 0.6,
        speed: (Math.random() * 0.5 + 0.2) * (i % 2 ? 1 : -1) * 0.00006,
        wobble: Math.random() * Math.PI * 2,
      }));
    };

    const polygon = (
      cx: number,
      cy: number,
      radius: number,
      sides: number,
      rotation: number
    ) => {
      ctx.beginPath();
      for (let i = 0; i <= sides; i++) {
        const a = rotation + (Math.PI * 2 * i) / sides;
        const x = cx + Math.cos(a) * radius;
        const y = cy + Math.sin(a) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    // asanoha (麻の葉): triangular lattice where every triangle also gets
    // spokes from its centroid to each vertex; clipped to a circle that
    // fades out toward the rim
    const asanoha = (
      cx: number,
      cy: number,
      radius: number,
      s: number,
      alpha: number,
      rotation: number,
      scale: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.scale(scale, scale);

      const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      grad.addColorStop(0, `rgba(${FAINT}, ${alpha * 1.4})`);
      grad.addColorStop(0.7, `rgba(${FAINT}, ${alpha})`);
      grad.addColorStop(1, `rgba(${FAINT}, 0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1;

      const tri = (
        a: [number, number],
        b: [number, number],
        c: [number, number]
      ) => {
        const gx = (a[0] + b[0] + c[0]) / 3;
        const gy = (a[1] + b[1] + c[1]) / 3;
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.lineTo(c[0], c[1]);
        ctx.lineTo(a[0], a[1]);
        ctx.moveTo(gx, gy);
        ctx.lineTo(a[0], a[1]);
        ctx.moveTo(gx, gy);
        ctx.lineTo(b[0], b[1]);
        ctx.moveTo(gx, gy);
        ctx.lineTo(c[0], c[1]);
      };

      const h = (s * Math.sqrt(3)) / 2;
      const jMax = Math.ceil(radius / h) + 1;
      const iMax = Math.ceil(radius / s) + 2;
      const reach = (radius + s) * (radius + s);
      ctx.beginPath();
      for (let j = -jMax; j < jMax; j++) {
        const y = j * h;
        const xoff = (((j % 2) + 2) % 2) * (s / 2);
        for (let i = -iMax; i < iMax; i++) {
          const x = i * s + xoff;
          if (x * x + y * y > reach) continue;
          tri([x, y], [x + s, y], [x + s / 2, y + h]);
          tri([x, y], [x + s / 2, y + h], [x - s / 2, y + h]);
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    // serif glyph drawn at an orbital position with optional glow
    const drawGlyph = (
      ch: string,
      x: number,
      y: number,
      size: number,
      tilt: number,
      fill: string,
      glow: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(tilt);
      ctx.font = `700 ${size}px Georgia, "Times New Roman", serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (glow > 0) {
        ctx.shadowColor = `rgba(${ACCENT}, 0.85)`;
        ctx.shadowBlur = glow;
      }
      ctx.fillStyle = fill;
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    };

    const LETTERS = ["K", "N", "Z"];
    // chromatic echo trail: green → red → blue → green, fading out
    const GHOSTS: Array<[string, number]> = [
      [`rgba(${ACCENT}, 0.20)`, 0],
      ["rgba(255, 70, 100, 0.11)", 0],
      ["rgba(80, 160, 255, 0.08)", 0],
      [`rgba(${ACCENT}, 0.04)`, 0],
    ];
    // per-letter glitch scheduling: a short burst roughly every ~3s
    const glitchState = LETTERS.map(() => ({ next: 0, until: 0 }));
    // current on-screen letter positions for the click hit-test (voice gate)
    const letterHits: { x: number; y: number; r: number }[] = [];

    const draw = (t: number) => {
      // fade previous frame instead of clearing — motion smears into trails
      if (reduced) {
        ctx.clearRect(0, 0, width, height);
      } else {
        ctx.fillStyle = "rgba(5, 7, 5, 0.14)";
        ctx.fillRect(0, 0, width, height);
      }
      const cx = width / 2;
      const cy = height * 0.46;
      const base = Math.min(width, height);
      const time = reduced ? 0 : t;

      // breathing asanoha lattice, drifting glacially
      const breathe = 1 + Math.sin(time * 0.00025) * 0.015;
      asanoha(cx, cy, base * 0.34, base * 0.08, 0.05, time * 0.000012, breathe);

      // nested rotating polygons (machine layer)
      const rot = time * 0.00006;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${ACCENT}, 0.20)`;
      polygon(cx, cy, base * 0.3, 6, rot);
      ctx.strokeStyle = `rgba(${ACCENT}, 0.12)`;
      polygon(cx, cy, base * 0.3, 3, -rot * 1.5);
      polygon(cx, cy, base * 0.3, 3, -rot * 1.5 + Math.PI);
      ctx.strokeStyle = `rgba(${FAINT}, 0.08)`;
      polygon(cx, cy, base * 0.42, 12, rot * 0.6);

      // outer orbit rings
      ctx.strokeStyle = `rgba(${FAINT}, 0.06)`;
      ctx.beginPath();
      ctx.arc(cx, cy, base * 0.3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, base * 0.42, 0, Math.PI * 2);
      ctx.stroke();

      // drifting nodes + hairline connections (nature layer)
      const pts = nodes.map((n) => {
        const a = n.a + time * n.speed;
        const wob = Math.sin(time * 0.0004 + n.wobble) * base * 0.01;
        return {
          x: cx + Math.cos(a) * (n.r + wob),
          y: cy + Math.sin(a) * (n.r + wob) * 0.85,
        };
      });

      ctx.lineWidth = 0.6;
      const linkDist = base * 0.28;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.hypot(dx, dy);
          if (d < linkDist) {
            ctx.strokeStyle = `rgba(${FAINT}, ${(1 - d / linkDist) * 0.12})`;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        ctx.fillStyle = `rgba(${ACCENT}, 0.55)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // words in orbit: far half behind the letters, near half in front
      const aMax = Math.min(base * 0.5, width * 0.46);
      const drawWords = (front: boolean) => {
        for (const wd of words) {
          const th = wd.phase + time * wd.speed;
          const z = Math.sin(th); // depth along the orbit, -1 (far) .. 1 (near)
          if (front ? z < 0 : z >= 0) continue;
          const ex = Math.cos(th) * aMax * wd.rad;
          const ey = Math.sin(th) * aMax * wd.rad * wd.flat;
          const ct = Math.cos(wd.tilt);
          const st = Math.sin(wd.tilt);
          const x = cx + ex * ct - ey * st;
          const y =
            cy +
            ex * st +
            ey * ct +
            (reduced ? 0 : Math.sin(time * 0.0004 + wd.bob) * base * 0.008);
          const depth = (z + 1) / 2;
          const size = base * 0.021 * (0.8 + depth * 0.4);
          ctx.font = `${size.toFixed(1)}px ${monoFont}, ui-monospace, monospace`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = `rgba(190, 215, 185, ${0.25 + depth * 0.5})`;
          ctx.fillText(wd.text, x, y);
        }
      };
      drawWords(false);

      // center seed with glow
      const pulse = 0.5 + (reduced ? 0 : Math.sin(time * 0.001) * 0.3);
      ctx.shadowColor = `rgba(${ACCENT}, 0.9)`;
      ctx.shadowBlur = 18;
      ctx.fillStyle = `rgba(${ACCENT}, ${pulse})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // K / N / Z riding the hexagram rotation (same -1.5x angular velocity)
      const formation = -rot * 1.5 - Math.PI / 2;
      const orbitR = base * 0.22;
      const fontSize = base * 0.15;
      for (let i = 0; i < LETTERS.length; i++) {
        const a = formation + (i * Math.PI * 2) / 3;
        const tilt = reduced ? 0 : Math.sin(time * 0.00025 + i * 2.1) * 0.16;
        // ghost echoes trail behind along the orbit (skipped without motion)
        if (!reduced) {
          for (let g = GHOSTS.length - 1; g >= 0; g--) {
            const ga = a + (g + 1) * 0.055;
            drawGlyph(
              LETTERS[i],
              cx + Math.cos(ga) * orbitR,
              cy + Math.sin(ga) * orbitR,
              fontSize * (1 + (g + 1) * 0.03),
              tilt,
              GHOSTS[g][0],
              0
            );
          }
        }
        const x = cx + Math.cos(a) * orbitR;
        const y = cy + Math.sin(a) * orbitR;
        letterHits[i] = { x, y, r: fontSize * 0.65 };

        // schedule short glitch bursts (~every 2.2–4.4s per letter)
        const g = glitchState[i];
        if (g.next === 0) g.next = time + 800 + Math.random() * 3000;
        if (time >= g.until && time >= g.next) {
          g.until = time + 120 + Math.random() * 200;
          g.next = time + 2200 + Math.random() * 2200;
        }
        const glitching = !reduced && time < g.until;

        if (glitching) {
          // horizontal slices, each torn sideways with harsh chroma split
          const jitterTilt = tilt + (Math.random() - 0.5) * 0.08;
          const SLICES = 4;
          const bandTop = y - fontSize * 0.62;
          const bandH = (fontSize * 1.24) / SLICES;
          for (let s = 0; s < SLICES; s++) {
            const dx = (Math.random() - 0.5) * fontSize * 0.22;
            ctx.save();
            ctx.beginPath();
            ctx.rect(x - fontSize, bandTop + s * bandH, fontSize * 2, bandH);
            ctx.clip();
            drawGlyph(LETTERS[i], x + dx - 7, y, fontSize, jitterTilt, "rgba(255, 45, 90, 0.55)", 0);
            drawGlyph(LETTERS[i], x + dx + 7, y, fontSize, jitterTilt, "rgba(60, 150, 255, 0.5)", 0);
            drawGlyph(LETTERS[i], x + dx, y, fontSize, jitterTilt, "#050705", 20);
            ctx.restore();
          }
          // occasional full-glyph acid flash
          if (Math.random() < 0.35) {
            drawGlyph(
              LETTERS[i],
              x + (Math.random() - 0.5) * 10,
              y + (Math.random() - 0.5) * 6,
              fontSize,
              jitterTilt,
              `rgba(${ACCENT}, 0.28)`,
              0
            );
          }
        } else {
          // chromatic fringe + black serif core with acid glow
          drawGlyph(LETTERS[i], x - 2.5, y, fontSize, tilt, "rgba(255, 45, 90, 0.35)", 0);
          drawGlyph(LETTERS[i], x + 2.5, y, fontSize, tilt, "rgba(60, 150, 255, 0.3)", 0);
          drawGlyph(LETTERS[i], x, y, fontSize, tilt, "#050705", 22);
        }
      }

      // near half of the word orbits passes in front of the letters
      drawWords(true);

      if (!reduced) raf = requestAnimationFrame(draw);
    };

    resize();
    initNodes();
    // paint the first frame immediately (rAF stays paused in hidden tabs);
    // when motion is enabled draw() re-schedules itself
    if (reduced) {
      draw(0);
    } else {
      draw(performance.now());
    }

    const onResize = () => {
      resize();
      initNodes();
      if (reduced) draw(0);
    };
    window.addEventListener("resize", onResize);

    // clicking a K/N/Z letter summons the voice authentication gate
    const hitAt = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      return letterHits.some((h) => Math.hypot(mx - h.x, my - h.y) < h.r);
    };
    const onClick = (e: MouseEvent) => {
      if (hitAt(e)) window.dispatchEvent(new Event("knz-voice-gate"));
    };
    const onMove = (e: MouseEvent) => {
      canvas.style.cursor = hitAt(e) ? "pointer" : "default";
    };
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
