import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import ContactChannels from "@/components/ContactChannels";
import Reveal from "@/components/Reveal";
import SatelliteCursor from "@/components/SatelliteCursor";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const channels = [
    {
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    { label: "LinkedIn", value: "View profile", href: site.links.linkedin },
    { label: "GitHub", value: "View repositories", href: site.links.github },
  ];

  return (
    <>
      <SatelliteCursor />
      <PageHeader eyebrow="Contact" title="Get in Touch" />

      <section className="section">
        <div className="container-content grid gap-12 md:grid-cols-[1fr_320px]">
          <Reveal from="left">
            <ContactForm />
          </Reveal>

          <Reveal as="aside" from="right" delay={120} className="h-fit space-y-6">
            <div className="rounded-xl border border-black/10 bg-white/55 p-6 shadow-sm backdrop-blur-sm">
              <p className="eyebrow mb-4">Direct</p>
              <ContactChannels channels={channels} />
            </div>

            <div className="rounded-xl border border-black/10 bg-white/55 p-6 shadow-sm backdrop-blur-sm">
              <p className="eyebrow mb-2">Location</p>
              <p className="text-sm text-black">{site.location}</p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
