import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line/10 bg-surface">
      <div className="container-content relative z-10 flex flex-col gap-8 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm">
          <p className="text-sm text-ink-soft">{site.intro}</p>
          <p className="mt-2 text-sm text-ink-muted">{site.location}</p>
        </div>

        <div className="flex gap-12">
          <div>
            <p className="eyebrow mb-3">Navigate</p>
            <ul className="space-y-2 text-sm">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-underline text-ink hover:text-ink-soft">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Connect</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#contact" className="link-underline text-ink hover:text-ink-soft">
                  Contact
                </Link>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="link-underline text-ink hover:text-ink-soft">
                  Email
                </a>
              </li>
              <li>
                <a href={site.links.github} target="_blank" rel="noreferrer" className="link-underline text-ink hover:text-ink-soft">
                  GitHub
                </a>
              </li>
              <li>
                <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="link-underline text-ink hover:text-ink-soft">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
