"use client";

import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    window.location.replace("/#contact");
  }, []);

  return (
    <main className="container-content section">
      <p className="text-sm text-black/70">
        Redirecting to{" "}
        <a href="/#contact" className="link-underline text-black">
          contact
        </a>
        …
      </p>
    </main>
  );
}
