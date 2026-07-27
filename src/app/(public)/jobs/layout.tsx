import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Retail Jobs & Promoter Opportunities | RetailTalent",
  description: "Find the best retail jobs, promoter jobs, and merchandiser roles across India. Apply instantly to top FMCG brands and agencies.",
  openGraph: {
    title: "Search Retail Jobs & Promoter Opportunities | RetailTalent",
    description: "Find the best retail jobs, promoter jobs, and merchandiser roles across India. Apply instantly to top FMCG brands.",
  },
};

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
