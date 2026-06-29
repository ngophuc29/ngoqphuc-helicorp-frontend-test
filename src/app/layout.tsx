import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://helicorp-landing-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "HelioPure Air | Smart Wellness Air Hub",
    template: "%s | HelioPure Air"
  },
  description:
    "Landing page gioi thieu HelioPure Air, thiet bi loc va theo doi chat luong khong khi thong minh cho nha hien dai.",
  keywords: ["smart air purifier", "healthy living", "IoT", "HelioPure Air", "landing page"],
  authors: [{ name: "Ngoc Phuc" }],
  openGraph: {
    title: "HelioPure Air | Smart Wellness Air Hub",
    description:
      "Thiet bi loc khong khi thong minh voi AI Auto Balance, dashboard suc khoe va ket noi mobile.",
    url: siteUrl,
    siteName: "HelioPure Air",
    images: [
      {
        url: "/images/heliopure-hero.png",
        width: 1200,
        height: 900,
        alt: "HelioPure Air smart air quality hub"
      }
    ],
    locale: "vi_VN",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "HelioPure Air | Smart Wellness Air Hub",
    description: "Landing page Next.js toi uu SEO va performance cho thiet bi thong minh.",
    images: ["/images/heliopure-hero.png"]
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7fbf8" },
    { media: "(prefers-color-scheme: dark)", color: "#101715" }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
