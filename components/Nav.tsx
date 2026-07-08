"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useI18n, type Lang } from "@/lib/i18n";

const LINKS = [
  { href: "/#listen", label: "Listen" },
  { href: "/#releases", label: "Releases" },
  { href: "/#goods", label: "Goods" },
  { href: "/#video", label: "Video" },
  { href: "/#profile", label: "Profile" },
  { href: "/#fans", label: "Fans" },
  { href: "/#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { lang, setLang } = useI18n();

  const langBtn = (l: Lang) =>
    `font-mono text-[10px] uppercase tracking-[0.15em] transition-colors ${
      lang === l ? "text-accent" : "text-muted hover:text-foreground"
    }`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-8">
        <Link href="/#top" className="flex items-center gap-2.5 group">
          {/* logo: triangle in circle */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            aria-hidden="true"
            className="transition-transform duration-700 group-hover:rotate-180"
          >
            <circle cx="14" cy="14" r="13" stroke="var(--accent)" strokeWidth="1" opacity="0.7" />
            <path d="M14 5.5 L21.5 19 L6.5 19 Z" stroke="var(--foreground)" strokeWidth="1" fill="none" />
            <circle cx="14" cy="14" r="1.5" fill="var(--accent)" />
          </svg>
          <span className="hidden font-mono text-sm tracking-[0.35em] text-foreground sm:inline">
            KNZ
          </span>
        </Link>

        <ul className="flex items-center gap-3.5 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-7">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.1em] sm:tracking-[0.2em] text-muted transition-colors hover:text-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="flex items-center gap-1.5 border-l border-line pl-3.5 sm:pl-5">
            <button type="button" onClick={() => setLang("ja")} className={langBtn("ja")}>
              JA
            </button>
            <span className="text-muted/40">/</span>
            <button type="button" onClick={() => setLang("en")} className={langBtn("en")}>
              EN
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
