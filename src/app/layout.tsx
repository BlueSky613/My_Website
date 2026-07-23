import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import MagneticCursor from "@/components/MagneticCursor";
import CursorEffects from "@/components/CursorEffects";
import AnimatedFavicon from "@/components/AnimatedFavicon";
import ViewportProvider from "@/components/ViewportProvider";
import { getMetadataBase } from "@/lib/metadata-base";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const siteTitle = `${site.name} — ${site.role}`;

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: siteTitle,
    template: `%s — ${site.name}`,
  },
  description: site.intro,
  applicationName: siteTitle,
  openGraph: {
    title: siteTitle,
    description: site.intro,
    siteName: siteTitle,
    type: "website",
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: site.intro,
  },
};

const themeBootScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var pref = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    var dark = pref === "dark" || (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    document.documentElement.dataset.themePreference = pref;
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-surface text-ink">
        <ViewportProvider />
        <ScrollProgress />
        <AnimatedFavicon />
        <MagneticCursor />
        <CursorEffects />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
