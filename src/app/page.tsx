"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sms-spam-api-uoqthydjdq-et.a.run.app";

interface PredictResult {
  prediction: number;
  label: string;
}

const EXAMPLES = [
  {
    tag: "Normal",
    text: "Halo, kamu jadi datang ke acara besok? Aku tunggu ya di kampus jam 9 pagi.",
  },
  {
    tag: "Spam",
    text: "SELAMAT! Anda memenangkan hadiah Rp 100.000.000! Klik link ini untuk klaim: http://spam.xyz",
  },
  {
    tag: "Promo",
    text: "FLASH SALE 12.12! Diskon hingga 90% untuk semua produk elektronik. Belanja sekarang di TokoBagus!",
  },
];

const BADGE_STYLES: Record<string, string> = {
  normal: "badge-normal",
  spam: "badge-spam",
  promo: "badge-promo",
};

const BADGE_EMOJI: Record<string, string> = {
  normal: "✅",
  spam: "🚫",
  promo: "📢",
};

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<PredictResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiHealthy, setApiHealthy] = useState<boolean | null>(null);

  /* ── health check ── */
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(`${API_URL}/health`, {
          cache: "no-store",
        });
        if (!cancelled) setApiHealthy(res.ok);
      } catch {
        if (!cancelled) setApiHealthy(false);
      }
    };
    check();
    const id = setInterval(check, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  /* ── predict ── */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!text.trim()) return;
      setLoading(true);
      setError(null);
      setResult(null);
      try {
        const res = await fetch(`${API_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.trim() }),
        });
        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data: PredictResult = await res.json();
        setResult(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [text],
  );

  const fillExample = (example: string) => {
    setText(example);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── API status indicator ── */}
      <div className="fixed top-4 right-4 z-50">
        <div className="glass-card px-3 py-1.5 flex items-center gap-2 text-xs">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              apiHealthy === null
                ? "bg-gray-400 animate-pulse-dot"
                : apiHealthy
                  ? "bg-emerald-400 animate-pulse-dot"
                  : "bg-red-400"
            }`}
          />
          <span className="text-white/60">
            {apiHealthy === null
              ? "Checking API…"
              : apiHealthy
                ? "API Online"
                : "API Offline"}
          </span>
        </div>
      </div>

      {/* ── Hero ── */}
      <header className="pt-16 pb-8 flex flex-col items-center gap-4 px-4">
        <Image
          src="/logo.png"
          alt="NgodingAI"
          width={180}
          height={60}
          className="h-14 w-auto"
          priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">
          SMS Spam Detector
        </h1>
        <p className="text-white/50 text-center max-w-md text-sm">
          Paste any SMS message and our ML model will classify it as{" "}
          <span className="text-emerald-400">normal</span>,{" "}
          <span className="text-red-400">spam</span>, or{" "}
          <span className="text-amber-400">promo</span>.
        </p>
      </header>

      {/* ── Main content ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pb-12 flex flex-col gap-6">
        {/* ── Input form ── */}
        <form onSubmit={handleSubmit} className="glass-card glow-accent p-6 flex flex-col gap-4">
          <label htmlFor="sms-input" className="text-sm font-medium text-white/70">
            SMS Message
          </label>
          <textarea
            id="sms-input"
            rows={4}
            placeholder="Type or paste an SMS message here…"
            className="w-full resize-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-brand-accent/50 transition"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="self-end px-6 py-2.5 rounded-xl bg-brand-accent text-brand-dark font-semibold text-sm hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Analyzing…
              </span>
            ) : (
              "Detect Spam"
            )}
          </button>
        </form>

        {/* ── Example buttons ── */}
        <div className="flex flex-col gap-2">
          <span className="text-xs text-white/40 uppercase tracking-wider">
            Try an example
          </span>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.tag}
                type="button"
                onClick={() => fillExample(ex.text)}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition"
              >
                {ex.tag}
              </button>
            ))}
          </div>
        </div>

        {/* ── Result ── */}
        {error && (
          <div className="glass-card p-5 border-red-500/30 animate-fade-in-up">
            <p className="text-red-400 text-sm">⚠️ {error}</p>
          </div>
        )}

        {result && (
          <div className="glass-card glow-accent p-6 flex flex-col items-center gap-4 animate-fade-in-up">
            <span className="text-4xl">{BADGE_EMOJI[result.label] ?? "❓"}</span>
            <span
              className={`inline-block px-5 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${BADGE_STYLES[result.label] ?? "bg-gray-500/20 text-gray-300 border border-gray-500/30"}`}
            >
              {result.label}
            </span>
            <p className="text-white/40 text-xs text-center">
              Model prediction code: {result.prediction}
            </p>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="py-6 text-center text-xs text-white/30 border-t border-white/5">
        Built by{" "}
        <span className="text-brand-accent/80 font-medium">Afif AI</span>{" "}
        &middot; GDGoC UIN Jakarta
      </footer>
    </div>
  );
}
