"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const subject = encodeURIComponent(`RolyPods inquiry from ${name || "website visitor"}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:support@rolypods.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-3xl font-bold text-bark dark:text-cream sm:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 text-bark/70 dark:text-cream-dark/80">
        Questions about a species, an order, stock availability, or bulk
        pricing for a cleanup crew? Send us a message and we&apos;ll get back
        to you as soon as we can.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="text-bark/70 dark:text-cream-dark/80">Name</span>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30"
          />
        </label>
        <label className="block text-sm">
          <span className="text-bark/70 dark:text-cream-dark/80">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30"
          />
        </label>
        <label className="block text-sm">
          <span className="text-bark/70 dark:text-cream-dark/80">Message</span>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="mt-1 w-full rounded-md border border-bark/20 bg-transparent px-3 py-2 dark:border-cream-dark/30"
          />
        </label>
        <button
          type="submit"
          className="rounded-full bg-moss px-6 py-3 text-sm font-semibold text-white transition hover:bg-moss-dark"
        >
          Send Message
        </button>
        <p className="text-xs text-bark/50 dark:text-cream-dark/60">
          This opens your email app with a message addressed to{" "}
          <a href="mailto:support@rolypods.com" className="underline">
            support@rolypods.com
          </a>
          .
        </p>
      </form>
    </div>
  );
}
