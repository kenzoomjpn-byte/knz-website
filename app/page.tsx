"use client";

import Nav from "@/components/Nav";
import SacredGeometry from "@/components/SacredGeometry";
import SoundCloudPlayer from "@/components/SoundCloudPlayer";
import Releases from "@/components/Releases";
import Socials from "@/components/Socials";
import ContactForm from "@/components/ContactForm";
import CursorAlien from "@/components/CursorAlien";
import Ganjalien from "@/components/Ganjalien";
import VoiceGate from "@/components/VoiceGate";
import BudComet from "@/components/BudComet";
import Videos from "@/components/Videos";
import Goods from "@/components/Goods";
import FansForm from "@/components/FansForm";
import Reveal from "@/components/Reveal";
import { useI18n } from "@/lib/i18n";

function SectionHeading({ index, en, sub }: { index: string; en: string; sub: string }) {
  return (
    <Reveal className="mb-10 sm:mb-14">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.4em] text-accent">
        {index}
      </p>
      <h2 className="text-2xl font-light tracking-[0.15em] sm:text-3xl">{en}</h2>
      <p className="mt-2 font-mono text-xs tracking-[0.3em] text-muted">{sub}</p>
    </Reveal>
  );
}

export default function Home() {
  const { t } = useI18n();
  return (
    <main id="top" className="flex-1">
      <Nav />
      <CursorAlien />
      <VoiceGate />
      <BudComet />

      {/* ---- hero ---- */}
      <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
        <SacredGeometry />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        {/* visible K/N/Z letters and orbiting words are drawn in the canvas */}
        <div className="relative z-10">
          <h1 className="sr-only">KNZ</h1>
          <p className="sr-only">Nature × Machine ∞ Universe</p>
          <p className="sr-only">宇宙音楽実験家 — Dance Music Producer</p>
        </div>

        <a
          href="#listen"
          aria-label="下へスクロール"
          className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted transition-colors hover:text-accent"
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" aria-hidden="true" className="animate-bounce">
            <path d="M8 2 V18 M3 13 L8 19 L13 13" stroke="currentColor" strokeWidth="1" />
          </svg>
        </a>
      </section>

      {/* ---- listen ---- */}
      <section id="listen" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading index="01" en="LISTEN" sub={t.sub.listen} />
        <Reveal>
          <SoundCloudPlayer />
        </Reveal>
      </section>

      {/* ---- releases ---- */}
      <section id="releases" className="border-t border-line">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="02" en="RELEASES" sub={t.sub.releases} />
          <Releases />
        </div>
      </section>

      {/* ---- goods ---- */}
      <section id="goods" className="border-t border-line">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="03" en="GOODS" sub={t.sub.goods} />
          <Goods />
        </div>
      </section>

      {/* ---- video ---- */}
      <section id="video" className="border-t border-line">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="04" en="VIDEO" sub={t.sub.video} />
          <Videos />
        </div>
      </section>

      {/* ---- profile ---- */}
      <section id="profile" className="border-t border-line">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="05" en="PROFILE" sub={t.sub.profile} />

          <div className="grid gap-12 md:grid-cols-[minmax(0,320px)_1fr] md:gap-16">
            {/* ganjalien portrait */}
            <Reveal>
              <Ganjalien />
            </Reveal>

            <Reveal delay={150}>
              <div className="space-y-6 text-sm leading-8 text-foreground/85 sm:text-[15px]">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                  {t.profile.heading}
                </p>
                <p>{t.profile.p1}</p>
                <p>{t.profile.p2}</p>
                <p>{t.profile.p3}</p>
                <dl className="grid grid-cols-2 gap-x-8 gap-y-4 border-t border-line pt-6 font-mono text-xs">
                  <div>
                    <dt className="uppercase tracking-[0.25em] text-muted">Base</dt>
                    <dd className="mt-1 text-foreground">Japan</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.25em] text-muted">Since</dt>
                    <dd className="mt-1 text-foreground">2026</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.25em] text-muted">Style</dt>
                    <dd className="mt-1 text-foreground">Underground Beats</dd>
                  </div>
                  <div>
                    <dt className="uppercase tracking-[0.25em] text-muted">Tools</dt>
                    <dd className="mt-1 text-foreground">{t.profile.tools}</dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- fans ---- */}
      <section id="fans" className="border-t border-line">
        <div className="mx-auto max-w-4xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="06" en="FANS" sub={t.sub.fans} />
          <Reveal>
            <p className="mb-10 text-sm leading-8 text-foreground/80">
              {t.fans.pitchA}
              <span className="text-accent">{t.fans.unreleased}</span>
              {t.fans.pitchB}
              <span className="text-accent">{t.fans.newVideos}</span>
              {t.fans.pitchC}
            </p>
            <FansForm />
          </Reveal>
        </div>
      </section>

      {/* ---- contact / socials ---- */}
      <section id="contact" className="border-t border-line">
        <div className="mx-auto max-w-6xl scroll-mt-24 px-5 py-24 sm:px-8 sm:py-32">
          <SectionHeading index="07" en="CONTACT" sub={t.sub.contact} />
          <div className="grid gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">
            <Reveal>
              <p className="mb-8 font-mono text-sm leading-8 tracking-[0.2em] text-foreground/80">
                I&apos;m here
                <br />
                <span className="text-accent">catching your signal</span>
              </p>
              <ContactForm />
            </Reveal>
            <Reveal delay={150}>
              <div className="lg:pt-1">
                <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
                  Follow
                </p>
                <Socials size="lg" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- footer ---- */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted/70">
            © 2026 KNZ — All frequencies reserved
          </p>
          <svg width="20" height="20" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="opacity-40">
            <circle cx="14" cy="14" r="13" stroke="var(--accent)" strokeWidth="1" />
            <path d="M14 5.5 L21.5 19 L6.5 19 Z" stroke="var(--foreground)" strokeWidth="1" fill="none" />
            <circle cx="14" cy="14" r="1.5" fill="var(--accent)" />
          </svg>
        </div>
      </footer>
    </main>
  );
}
