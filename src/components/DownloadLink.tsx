"use client";

// A download anchor that records the download in the global counter, then
// lets the browser proceed with the file download as normal.
export default function DownloadLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  async function handleClick() {
    try {
      await fetch("/api/counters/download", { method: "POST" });
    } catch {
      // Counting is best-effort; never block the actual download.
    }
  }

  return (
    <a
      href={href}
      download
      onClick={handleClick}
      className={`${className} transition active:scale-[0.98]`}
    >
      {children}
    </a>
  );
}
