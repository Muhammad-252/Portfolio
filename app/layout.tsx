import "./globals.css";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export const metadata = {
  title: "Muhammad Arslan — UI/UX & Product Designer",
  description: "Portfolio of Muhammad Arslan — UI/UX, product, web and no-code design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}<WhatsAppFloat /></body>
    </html>
  );
}
