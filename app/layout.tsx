import type { Metadata } from "next";
import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata: Metadata = {
  title: "Muhammad Arslan — UI/UX & Product Designer",
  description: "Portfolio of Muhammad Arslan — UI/UX, product, web and no-code design.",
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
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}
