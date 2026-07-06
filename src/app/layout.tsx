import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RetailTalent | India's Trusted Marketplace for Retail Hiring",
  description: "Hire verified retail promoters, merchandisers, sales executives, and event staff across India—or discover your next retail opportunity.",
  keywords: "retail hiring, retail jobs, promoters, merchandisers, FMCG jobs India, sales executives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
