import HeroSection from '@/components/landing/HeroSection';
import KineticMarquee from '@/components/landing/KineticMarquee';
import CuratedAteliers from '@/components/landing/CuratedAteliers';
import ProblemSolution from '@/components/landing/ProblemSolution';
import BrandShowcase from '@/components/landing/BrandShowcase';
import MobileHomeView from '@/components/landing/MobileHomeView';



export default function Home() {
  return (
    <>
      {/* 1. DEDICATED MOBILE HOME VIEW (Option A: High Fashion Editorial Lookbook) */}
      <div className="block md:hidden">
        <MobileHomeView />
      </div>

      {/* 2. DESKTOP LUXURY LANDING VIEW */}
      <div className="hidden md:flex flex-col">
        {/* Hero Section with Automated Morphing FLIP Lookbook */}
        <HeroSection />

        {/* Dual-Row Velocity Kinetic Marquee */}
        <KineticMarquee />

        {/* Curated Nigerian Ateliers (Bright, Crisp HD Editorial Cards) */}
        <CuratedAteliers />

        {/* The Veyra Standards Luxury Pillars */}
        <ProblemSolution />

        {/* Partner Brands & Fast Lagos Delivery Matrix */}
        <BrandShowcase />
      </div>
    </>
  );
}
