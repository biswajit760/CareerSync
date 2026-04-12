import FeaturesSection from "@/components/HomePage/FetureSection";
import HeroSection from "@/components/HomePage/HeroSection";
import ResumeUploadSection from "@/components/HomePage/ResumeUploadSection";
import Stats from "@/components/HomePage/Stats";
import Testimonials from "@/components/HomePage/Testimonials";

export default function Home() {
  return (
    <>
    <HeroSection/>
    <ResumeUploadSection />
    <Stats />
    <FeaturesSection />
    <Testimonials />
    
    </>
  );
}