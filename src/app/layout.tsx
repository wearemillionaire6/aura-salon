import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontDisplay = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aura Salon & Spa | West Village",
    template: "%s | Aura Salon & Spa",
  },
  description: "A destination salon for the way you actually live. Hair, nails, skin, and bodywork in a quiet, considered space in the West Village.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
