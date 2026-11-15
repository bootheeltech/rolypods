"use client";

import { useState } from "react";

interface Props {
  /** Product slug, or "any" for the general drop list. */
  slug: string;
  heading?: string;
  blurb?: string;
  compact?: boolean;
}

export default function WaitlistForm({ slug, heading, blurb, compact = false }: Props) {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, slug, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="rounded-xl border border-moss/30 bg-moss/10 px-4 py-3 text-sm font-medium text-moss-dark dark:text-cream">
        You&apos;re on the list. We&apos;ll email <strong>{email}</strong> as soon as they&apos;re ready to ship.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border border-blush/30 bg-blush/10 ${compact ? "p-4" : "p-5"}`}
    >
      {heading && <p className="font-serif text-lg font-bold text-bark dark:text-cream">{heading}</p>}
      {blurb && <p className="mt-1 text-sm text-bark/75 dark:text-cream-dark/85">{blurb}</p>}
      <div className={`flex flex-col gap-2 sm:flex-row ${heading || blurb ? "mt-3" : ""}`}>
        <label className="sr-only" htmlFor={`waitlist-${slug}`}>
          Email address
        </label>
        <input
          id={`waitlist-${slug}`}
          required
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-full border border-bark/20 bg-white/80 px-4 py-2.5 text-sm text-bark dark:border-cream-dark/30 dark:bg-transparent dark:text-cream"
        />
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          name="website"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-blush px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blush-dark disabled:opacity-60"
        >
          {state === "sending" ? "Adding you..." : "Join the waitlist"}
        </button>
      </div>
      {state === "error" && <p className="mt-2 text-sm text-blush-dark">{error}</p>}
    </form>
  );
}
