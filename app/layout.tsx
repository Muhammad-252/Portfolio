import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import BackToTop from "@/components/BackToTop";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.muhammadarslan.com";
const gaId = process.env.NEXT_PUBLIC_GA_ID || "G-REV2ZTCNLB";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Muhammad Arslan | UI/UX Designer, Webflow & WordPress Developer",
    template: "%s | Muhammad Arslan",
  },
  description:
    "Muhammad Arslan is a UI/UX designer and Webflow & WordPress developer creating user-focused websites, web apps and digital products for startups and businesses.",
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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Muhammad Arslan Portfolio",
    title: "Muhammad Arslan | UI/UX Designer, Webflow & WordPress Developer",
    description:
      "Muhammad Arslan is a UI/UX designer and Webflow & WordPress developer creating user-focused websites, web apps and digital products for startups and businesses.",
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
    title: "Muhammad Arslan | UI/UX Designer, Webflow & WordPress Developer",
    description:
      "Muhammad Arslan is a UI/UX designer and Webflow & WordPress developer creating user-focused websites, web apps and digital products for startups and businesses.",
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
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
        {children}
        <BackToTop />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
