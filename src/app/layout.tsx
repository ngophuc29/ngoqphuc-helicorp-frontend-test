import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://auraband-x-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "AuraBand X | Your Health, Redefined",
    template: "%s | AuraBand X"
  },
  description:
    "AuraBand X is a premium smart fitness wearable featuring clinical-grade tracking, a 14-day battery life, and an elegant design.",
  keywords: ["AuraBand X", "smart fitness band", "wellness tracker", "wearable", "landing page"],
  authors: [{ name: "Ngoc Phuc" }],
  openGraph: {
    title: "AuraBand X | Your Health, Redefined",
    description:
      "Precision sensors, 14-day battery life and a polished wearable design for next-generation wellness tracking.",
    url: siteUrl,
    siteName: "AuraBand X",
    images: [
      {
        url: "/images/auraband-hero.png",
        width: 1264,
        height: 864,
        alt: "AuraBand X smart fitness wearable"
      }
    ],
    locale: "vi_VN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "AuraBand X | Your Health, Redefined",
    description: "Optimized Next.js landing page for the AuraBand X smart fitness wearable, designed for peak performance and SEO.",
    images: ["/images/auraband-hero.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f9fb"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
