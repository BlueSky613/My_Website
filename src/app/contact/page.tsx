import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import ContactChannels from "@/components/ContactChannels";
import Reveal from "@/components/Reveal";
import SatelliteCursor from "@/components/SatelliteCursor";
import DataLandscape from "@/components/DataLandscape";
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
      <div className="relative isolate min-h-screen overflow-hidden">
        <DataLandscape />
        <div className="relative z-10">
          <PageHeader eyebrow="Contact" title="Get in Touch" />

          <section className="section">
            <div className="container-content grid gap-12 md:grid-cols-[1fr_320px]">
              <Reveal from="left">
                <ContactForm />
              </Reveal>

              <Reveal as="aside" from="right" delay={120} className="h-fit space-y-6">
                <div className="rounded-xl border border-cyber-400/20 bg-rock-900/60 p-6 shadow-glow-soft backdrop-blur-sm">
                  <p className="eyebrow mb-4">Direct</p>
                  <ContactChannels channels={channels} />
                </div>

                <div className="rounded-xl border border-cyber-400/20 bg-rock-900/60 p-6 shadow-glow-soft backdrop-blur-sm">
                  <p className="eyebrow mb-2">Location</p>
                  <p className="text-sm text-rock-100">{site.location}</p>
                </div>
              </Reveal>
            </div>
          </section>
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-[5] bg-gradient-to-b from-rock-950/30 via-rock-950/50 to-rock-950/90"
        />
      </div>
    </>
  );
}
