"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border border-line bg-surface/60 px-4 py-3 text-sm text-foreground " +
  "placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

const labelClass =
  "mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted";

export default function FansForm() {
  const [status, setStatus] = useState<Status>("idle");
  const { t } = useI18n();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="border border-accent-dim bg-accent/[0.04] px-6 py-12 text-center">
        <p className="font-mono text-sm uppercase tracking-[0.35em] text-accent">
          {t.fans.successTitle}
        </p>
        <p className="mt-4 text-sm leading-7 text-foreground/80">{t.fans.successBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Last name *</span>
          <input
            name="lastName"
            required
            maxLength={60}
            autoComplete="family-name"
            placeholder={t.fans.lastPh}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>First name *</span>
          <input
            name="firstName"
            required
            maxLength={60}
            autoComplete="given-name"
            placeholder={t.fans.firstPh}
            className={inputClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Email *</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className={labelClass}>Location *</span>
          <input
            name="location"
            required
            maxLength={100}
            autoComplete="country-name"
            placeholder={t.fans.locPh}
            className={inputClass}
          />
        </label>
      </div>

      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-accent-dim px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
        >
          {status === "sending" ? t.fans.joining : t.fans.join}
        </button>
        {status === "error" && (
          <p className="font-mono text-[11px] tracking-[0.15em] text-red-400/80">{t.fans.error}</p>
        )}
        <p className="font-mono text-[10px] tracking-[0.1em] text-muted/70">
          {t.fans.privacy}
        </p>
      </div>
    </form>
  );
}
