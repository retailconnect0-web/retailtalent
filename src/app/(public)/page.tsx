import { HeroSection } from "@/components/home/HeroSection";
import { OnboardingModal } from "@/components/home/OnboardingModal";

export default function Home() {
  return (
    <div className="flex flex-col">
      <OnboardingModal />
      <HeroSection />
    </div>
  );
}
