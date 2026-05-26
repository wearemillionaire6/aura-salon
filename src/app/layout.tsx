import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, DM_Mono } from "next/font/google";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const fontDisplay = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const fontSans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fontMono = DM_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Aura | West Village",
    template: "%s | Aura",
  },
  description: "A destination salon for the way you actually live. Hair, nails, skin, and bodywork in a quiet, considered space in the West Village.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable} ${fontMono.variable} scroll-smooth`}>
      <body className="min-h-screen bg-[var(--color-background)] text-[var(--color-on-surface)] font-sans antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
