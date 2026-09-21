import type { Metadata, Viewport } from "next";
import { Archivo, JetBrains_Mono, Manrope } from "next/font/google";
import { BrandEntranceCurtain } from "@/components/BrandEntranceCurtain";
import { ModalProvider } from "@/components/modal-context";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const heading = Archivo({
  subsets: ["latin"],
  variable: "--font-heading-loaded",
  display: "swap",
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body-loaded",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-loaded",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ecellgu.in"),
  title: {
    default: "Galgotias Entrepreneurship Cell",
    template: "%s | GEC",
  },
  description:
    "A student-driven entrepreneurship ecosystem where ideas are explored, builders grow, and aspiring founders find their next step.",
  applicationName: "Galgotias Entrepreneurship Cell",
  keywords: [
    "Galgotias Entrepreneurship Cell",
    "student entrepreneurship",
    "startup community",
    "Galgotias University",
    "GICRISE",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Galgotias Entrepreneurship Cell",
    title: "Ideas begin here. Builders grow here.",
    description:
      "Explore the people, programs, and stories moving the Galgotias entrepreneurial ecosystem forward.",
  },
};

export const viewport: Viewport = {
  themeColor: "#FCF8ED",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${mono.variable}`}
    >
      <body>
        <ModalProvider>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <BrandEntranceCurtain targetSlotId="navbar-brand-logo" />
          <SiteHeader />
          <main id="main-content">{children}</main>
          <SiteFooter />
        </ModalProvider>
      </body>
    </html>
  );
}
