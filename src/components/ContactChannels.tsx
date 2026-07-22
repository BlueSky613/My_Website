"use client";

import { useState } from "react";

type Channel = {
  label: string;
  value: string;
  href: string;
};

export default function ContactChannels({ channels }: { channels: Channel[] }) {
  // Track which channel was last clicked so its text stays highlighted.
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  return (
    <ul className="space-y-4">
      {channels.map((c) => {
        const isActive = c.label === activeLabel;
        return (
          <li key={c.label}>
            <p className="text-xs font-mono uppercase tracking-wider text-black/50">
              {c.label}
            </p>
            <a
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              onClick={() => setActiveLabel(c.label)}
              className={`mt-1 block text-sm break-words transition-colors hover:text-black/70 ${
                isActive ? "font-semibold text-black" : "text-black"
              }`}
            >
              {c.value}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
