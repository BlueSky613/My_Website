"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Failed to send message.");
      }

      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const field =
    "w-full rounded-lg border border-line/20 bg-surface-elevated px-4 py-2.5 text-sm text-ink placeholder-ink-muted outline-none transition duration-200 hover:border-line/40 focus:border-ink focus:ring-1 focus:ring-ink/15 focus:bg-surface-elevated";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-ink">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            placeholder="Your name"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-ink">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm text-ink">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-y`}
          placeholder="How can I help?"
        />
      </div>

      <button
        type="submit"
        className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "sent" && (
        <p className="text-sm text-ink" role="status">
          Thanks — your message has been sent. I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          {errorMsg}
        </p>
      )}
      {status !== "sent" && status !== "error" && (
        <p className="text-xs text-ink-muted">
          Your message is sent directly — no email client required.
        </p>
      )}
    </form>
  );
}
