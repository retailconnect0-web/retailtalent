import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Staff - Promoters, Merchandisers & Sales Executives | RetailTalent",
  description: "Recruit top-tier retail talent across India. Find promoters, merchandisers, and sales executives quickly and easily on RetailTalent.",
  openGraph: {
    title: "Hire Staff - Promoters, Merchandisers & Sales Executives | RetailTalent",
    description: "Recruit top-tier retail talent across India. Find promoters, merchandisers, and sales executives quickly and easily on RetailTalent.",
  },
};

export default function HireLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
