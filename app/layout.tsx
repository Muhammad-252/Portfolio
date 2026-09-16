import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BackToTop from "@/components/BackToTop";
import ChainCursor from "@/components/ChainCursor";
import BlobGooeyFilter from "@/components/ui/BlobGooeyFilter";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.muhammadarslan.com";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-REV2ZTCNLB";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Arslan | UI/UX Designer & Web Developer",
    template: "%s | Muhammad Arslan",
  },
  description:
    "UI/UX designer and Webflow developer creating high-impact websites and digital products that convert for startups and ambitious brands.",
  keywords: [
    "UI/UX Designer",
    "Webflow Developer",
    "WordPress Developer",
    "Product Designer",
    "Digital Product Designer",
    "Freelance UI/UX Designer",
    "UI/UX Designer for Startups",
    "Webflow Designer and Developer",
    "WordPress UI/UX Designer",
    "Figma UI/UX Designer",
  ],
  authors: [{ name: "Muhammad Arslan", url: siteUrl }],
  creator: "Muhammad Arslan",
  publisher: "Muhammad Arslan",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Muhammad Arslan Portfolio",
    title: "Muhammad Arslan | UI/UX Designer & Web Developer",
    description:
      "UI/UX designer and Webflow developer creating high-impact websites and digital products that convert for startups and ambitious brands.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Muhammad Arslan — UI/UX Designer, Webflow & WordPress Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Arslan | UI/UX Designer & Web Developer",
    description:
      "UI/UX designer and Webflow developer creating high-impact websites and digital products that convert for startups and ambitious brands.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "googlec66e29b6126c6554",
  },
  other: {
    "google-site-verification": "googlec66e29b6126c6554.html",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body suppressHydrationWarning>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
        <ChainCursor />
        <BlobGooeyFilter />
        {children}
        <BackToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
