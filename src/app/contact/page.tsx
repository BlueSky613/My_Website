import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const channels = [
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      label: "Email (secondary)",
      value: site.emailSecondary,
      href: `mailto:${site.emailSecondary}`,
    },
    { label: "LinkedIn", value: "View profile", href: site.links.linkedin },
    { label: "GitHub", value: "View repositories", href: site.links.github },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in Touch"
        description="Open to GIS, geological mapping and mineral exploration opportunities in Western Australia and beyond."
      />

      <section className="section">
        <div className="container-content grid gap-12 md:grid-cols-[1fr_320px]">
          <Reveal from="left">
            <ContactForm />
          </Reveal>

          <Reveal as="aside" from="right" delay={120} className="h-fit space-y-6">
            <div className="rounded-xl border border-cyber-400/20 bg-rock-900/60 p-6 shadow-glow-soft backdrop-blur-sm">
              <p className="eyebrow mb-4">Direct</p>
              <ul className="space-y-4">
                {channels.map((c) => (
                  <li key={c.label}>
                    <p className="text-xs font-mono uppercase tracking-wider text-rock-500">
                      {c.label}
                    </p>
                    <a
                      href={c.href}
                      target={c.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="mt-1 block text-sm text-rock-100 hover:text-ore-400 break-words"
                    >
                      {c.value}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-cyber-400/20 bg-rock-900/60 p-6 shadow-glow-soft backdrop-blur-sm">
              <p className="eyebrow mb-2">Location</p>
              <p className="text-sm text-rock-100">{site.location}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
