import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://retailtalent.in"),
  title: {
    default: "RetailTalent | India's Trusted Marketplace for Retail Hiring",
    template: "%s | RetailTalent",
  },
  description: "Hire verified retail promoters, merchandisers, sales executives, and event staff across India—or discover your next retail opportunity.",
  keywords: ["retail hiring", "retail jobs", "promoters", "merchandisers", "FMCG jobs India", "sales executives", "retail staffing", "store managers India", "retail talent"],
  authors: [{ name: "RetailTalent" }],
  creator: "RetailTalent",
  publisher: "RetailTalent",
  alternates: {
    canonical: "https://retailtalent.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://retailtalent.in",
    title: "RetailTalent | India's Trusted Marketplace for Retail Hiring",
    description: "Hire verified retail promoters, merchandisers, and sales staff across India—or discover your next retail opportunity.",
    siteName: "RetailTalent",
  },
  twitter: {
    card: "summary_large_image",
    title: "RetailTalent | India's Trusted Marketplace for Retail Hiring",
    description: "Hire verified retail staff across India or find your next retail job.",
    creator: "@retailtalent",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "RetailTalent",
    "url": "https://retailtalent.in",
    "logo": "https://retailtalent.in/icon.svg",
    "description": "India's trusted marketplace for hiring verified retail promoters, merchandisers, and sales executives.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9986698096",
      "contactType": "customer service",
      "areaServed": "IN",
      "availableLanguage": "en"
    }
  };

  return (
    <html lang="en" className={`${inter.variable} font-sans antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
