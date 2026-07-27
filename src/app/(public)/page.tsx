import { HeroSection } from "@/components/home/HeroSection";
import { OnboardingModal } from "@/components/home/OnboardingModal";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire Retail Promoters & Sales Executives in India | RetailTalent",
  description: "RetailTalent is India's largest marketplace to hire verified FMCG promoters, merchandisers, and field staff. Start hiring today.",
  openGraph: {
    title: "Hire Retail Promoters & Sales Executives in India | RetailTalent",
    description: "RetailTalent is India's largest marketplace to hire verified FMCG promoters, merchandisers, and field staff.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      <OnboardingModal />
      <HeroSection />
    </div>
  );
}
