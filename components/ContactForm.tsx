"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "w-full border border-line bg-surface/60 px-4 py-3 text-sm text-foreground " +
  "placeholder:text-muted/60 outline-none transition-colors focus:border-accent";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const { t } = useI18n();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
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
      <div className="border border-line bg-surface/60 px-6 py-10 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
          {t.contact.successTitle}
        </p>
        <p className="mt-3 text-sm leading-7 text-foreground/80">
          {t.contact.successBody}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            Name *
          </span>
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder={t.contact.namePh}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
            Email *
          </span>
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
      </div>

      <label className="block">
        <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-muted">
          Message *
        </span>
        <textarea
          name="message"
          required
          maxLength={5000}
          rows={6}
          placeholder={t.contact.msgPh}
          className={`${inputClass} resize-y`}
        />
      </label>

      {/* honeypot — hidden from humans, bots tend to fill it */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="flex items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="border border-accent-dim px-8 py-3 font-mono text-xs uppercase tracking-[0.3em] text-accent transition-colors hover:border-accent hover:bg-accent/10 disabled:opacity-50"
        >
          {status === "sending" ? t.contact.sending : t.contact.send}
        </button>
        {status === "error" && (
          <p className="font-mono text-[11px] tracking-[0.15em] text-red-400/80">
            {t.contact.error}
          </p>
        )}
      </div>
    </form>
  );
}
