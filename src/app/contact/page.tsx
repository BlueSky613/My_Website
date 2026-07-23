"use client";

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    window.location.replace("/#contact");
  }, []);

  return (
    <main className="container-content section">
      <p className="text-sm text-ink-soft">
        Redirecting to{" "}
        <a href="/#contact" className="link-underline text-ink">
          contact
        </a>
        …
      </p>
    </main>
  );
}
