"use client";

import { useEffect, useRef, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";

const STORAGE_KEY = "theme";

function resolveTheme(pref: ThemePreference): "light" | "dark" {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return pref;
}

export function applyTheme(pref: ThemePreference) {
  const resolved = resolveTheme(pref);
  document.documentElement.setAttribute("data-theme", resolved);
  document.documentElement.dataset.themePreference = pref;
  try {
    localStorage.setItem(STORAGE_KEY, pref);
  } catch {
    /* ignore */
  }
}

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export default function ThemeToggle() {
  const [pref, setPref] = useState<ThemePreference>("system");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemePreference | null;
      if (stored === "light" || stored === "dark" || stored === "system") {
        setPref(stored);
        applyTheme(stored);
        return;
      }
    } catch {
      /* ignore */
    }
    applyTheme("system");
  }, []);

  useEffect(() => {
    if (pref !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function select(next: ThemePreference) {
    setPref(next);
    applyTheme(next);
    setOpen(false);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Toggle theme"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-md text-ink transition hover:bg-ink/10"
      >
        {/* Moon / sun swap by resolved theme via CSS */}
        <svg
          className="h-[18px] w-[18px] theme-icon-moon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <path
            d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <svg
          className="h-[18px] w-[18px] theme-icon-sun"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-[80] mt-2 min-w-[9.5rem] rounded-xl border border-line bg-surface-elevated p-1.5 shadow-lg"
        >
          {OPTIONS.map((opt) => {
            const active = pref === opt.value;
            return (
              <li key={opt.value} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => select(opt.value)}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                    active
                      ? "bg-ink/10 font-medium text-ink"
                      : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
