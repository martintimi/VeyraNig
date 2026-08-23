import HeroSection from '@/components/landing/HeroSection';
import KineticMarquee from '@/components/landing/KineticMarquee';
import CuratedAteliers from '@/components/landing/CuratedAteliers';
import ProblemSolution from '@/components/landing/ProblemSolution';
import BrandShowcase from '@/components/landing/BrandShowcase';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* 1. Hero Section with Automated Morphing FLIP Lookbook */}
      <HeroSection />

      {/* 2. Dual-Row Velocity Kinetic Marquee */}
      <KineticMarquee />

      {/* 3. Curated Nigerian Ateliers (Bright, Crisp HD Editorial Cards) */}
      <CuratedAteliers />

      {/* 4. The Veyra Standards Luxury Pillars */}
      <ProblemSolution />

      {/* 5. Partner Brands & Fast Lagos Delivery Matrix */}
      <BrandShowcase />
    </div>
  );
}
