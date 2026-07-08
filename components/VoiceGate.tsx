"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

/**
 * KNZ の文字クリックで起動する音声認証ゲート。
 * 合言葉「ケンズーム」を認識すると TARGET_URL を新しいタブで開く。
 * 起動イベントはcanvas側から window の "knz-voice-gate" で届く。
 * Web Speech API 非対応ブラウザではテキスト入力にフォールバック。
 */

const TARGET_URL =
  "https://www.seed-city.com/ja/green-house-seeds/super-lemon-haze-auto";

type Phase = "hidden" | "listening" | "denied" | "granted" | "manual";

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult:
    | ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};

const getSRClass = (): (new () => SR) | null => {
  const w = window as unknown as {
    SpeechRecognition?: new () => SR;
    webkitSpeechRecognition?: new () => SR;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

// 編集距離(あいまい一致用)
const lev = (a: string, b: string) => {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return dp[a.length][b.length];
};

// norm 内のどこかに target と編集距離 maxD 以内の部分文字列があれば true
const fuzzyIncludes = (norm: string, target: string, maxD: number) => {
  for (let len = target.length - maxD; len <= target.length + maxD; len++) {
    if (len < 2) continue;
    for (let i = 0; i + len <= norm.length; i++) {
      if (lev(norm.slice(i, i + len), target) <= maxD) return true;
    }
  }
  return false;
};

// カタカナ→ひらがな正規化 + かなり緩いあいまい一致。
// 「ケンズーム」と言っていれば多少の聞き取り揺れでも通す。
const isPassphrase = (raw: string) => {
  const norm = raw
    .toLowerCase()
    .replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\s、。・.,!?！?ー―−-]/g, (c) => (c === "ー" ? "ー" : ""))
    .replace(/[\s]/g, "");
  return (
    /(けん|健|剣|拳|券|検|県|見|建|軒|間|k[ae]n).{0,4}(ず|す|zu|su|boo|bu|z)[ぅう]?ー?(む|ム|m)/.test(norm) ||
    /zoo?m|ずーむ|すーむ|ずむ/.test(norm) === true && /けん|健|剣|検|県|見|ken|kem/.test(norm) ||
    fuzzyIncludes(norm, "けんずーむ", 2) ||
    fuzzyIncludes(norm, "けんずうむ", 2) ||
    fuzzyIncludes(norm, "kenzoom", 2) ||
    fuzzyIncludes(norm, "kenzumu", 2)
  );
};

export default function VoiceGate() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const recRef = useRef<SR | null>(null);
  const grantedRef = useRef(false);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [manualInput, setManualInput] = useState("");
  const [heard, setHeard] = useState("");
  const { t } = useI18n();

  const grant = useCallback(() => {
    grantedRef.current = true;
    recRef.current?.abort();
    setPhase("granted");
    setTimeout(() => {
      window.open(TARGET_URL, "_blank", "noopener");
    }, 900);
  }, []);

  const listen = useCallback(() => {
    const SRClass = getSRClass();
    if (!SRClass) {
      setPhase("manual");
      return;
    }
    grantedRef.current = false;
    setHeard("");
    const rec = new SRClass();
    recRef.current = rec;
    rec.lang = "ja-JP";
    rec.continuous = true; // 言い直しも拾えるよう聞き続ける
    rec.interimResults = true;
    rec.maxAlternatives = 5; // 認識候補をすべて評価する
    rec.onresult = (e) => {
      let all = "";
      for (let i = 0; i < e.results.length; i++) {
        for (let j = 0; j < e.results[i].length; j++) {
          const t = e.results[i][j].transcript;
          all += t + " ";
          if (isPassphrase(t)) {
            grant();
            return;
          }
        }
      }
      setHeard(all.trim());
      if (isPassphrase(all)) grant();
    };
    rec.onend = () => {
      if (!grantedRef.current) {
        setPhase((p) => (p === "listening" ? "denied" : p));
      }
    };
    rec.onerror = () => {
      if (!grantedRef.current) setPhase("denied");
    };
    setPhase("listening");
    try {
      rec.start();
      // 10秒で聞き取りを締め切り、onend → 判定へ
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => rec.stop(), 10000);
    } catch {
      setPhase("denied");
    }
  }, [grant]);

  const close = useCallback(() => {
    recRef.current?.abort();
    recRef.current = null;
    setPhase("hidden");
    setManualInput("");
  }, []);

  useEffect(() => {
    const open = () => listen();
    window.addEventListener("knz-voice-gate", open);
    return () => {
      window.removeEventListener("knz-voice-gate", open);
      recRef.current?.abort();
    };
  }, [listen]);

  useEffect(() => {
    if (phase === "hidden") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  if (phase === "hidden") return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/85 px-6 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="音声認証"
      onClick={close}
    >
      <div
        className="relative w-full max-w-sm border border-line bg-surface px-8 py-10 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label={t.voice.close}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center font-mono text-muted transition-colors hover:text-accent"
        >
          ×
        </button>

        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-muted">
          Voice Authentication
        </p>

        {phase === "listening" && (
          <>
            <div className="relative mx-auto mt-8 h-20 w-20">
              <span className="absolute inset-0 animate-ping rounded-full border border-accent-dim" />
              <span className="absolute inset-0 flex items-center justify-center rounded-full border border-accent">
                {/* mic */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="9" y="3" width="6" height="11" rx="3" stroke="var(--accent)" strokeWidth="1.5" />
                  <path d="M5 11 a7 7 0 0 0 14 0 M12 18 v3" stroke="var(--accent)" strokeWidth="1.5" />
                </svg>
              </span>
            </div>
            <p className="mt-8 font-mono text-xs tracking-[0.2em] text-foreground/80">
              {t.voice.prompt}
            </p>
          </>
        )}

        {phase === "denied" && (
          <>
            <p className="mt-8 font-mono text-sm tracking-[0.3em] text-red-400/90">
              ACCESS DENIED
            </p>
            {heard && (
              <p className="mt-3 font-mono text-[10px] tracking-[0.1em] text-muted">
                {t.voice.heard}「{heard.slice(0, 40)}」
              </p>
            )}
            <button
              type="button"
              onClick={listen}
              className="mt-6 border border-line px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Retry
            </button>
          </>
        )}

        {phase === "granted" && (
          <>
            <p className="mt-8 font-mono text-sm tracking-[0.3em] text-accent">
              ACCESS GRANTED
            </p>
            <a
              href={TARGET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border border-accent-dim px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-accent transition-colors hover:border-accent hover:bg-accent/10"
            >
              Open Transmission
            </a>
          </>
        )}

        {phase === "manual" && (
          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (isPassphrase(manualInput)) grant();
              else setPhase("denied");
            }}
          >
            <p className="font-mono text-[11px] tracking-[0.15em] text-muted">
              {t.voice.manual}
            </p>
            <input
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full border border-line bg-background px-4 py-2.5 text-center font-mono text-sm text-foreground outline-none focus:border-accent"
            />
            <button
              type="submit"
              className="border border-line px-6 py-2.5 font-mono text-xs uppercase tracking-[0.25em] text-muted transition-colors hover:border-accent hover:text-accent"
            >
              Verify
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
