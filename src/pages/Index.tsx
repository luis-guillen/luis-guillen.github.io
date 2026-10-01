import Navbar from "@/components/portfolio/Navbar";
import HeroSection from "@/components/portfolio/HeroSection";
import AboutSection from "@/components/portfolio/AboutSection";
import ExperienceSection from "@/components/portfolio/ExperienceSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import SkillsSection from "@/components/portfolio/SkillsSection";
import CredentialsSection from "@/components/portfolio/CredentialsSection";
import AchievementsSection from "@/components/portfolio/AchievementsSection";
import ContactSection from "@/components/portfolio/ContactSection";
import Footer from "@/components/portfolio/Footer";
import { lazy, Suspense } from "react";
import { useReveal } from "@/hooks/use-reveal";

// three.js ships in its own chunk so the text paints first.
const TileField = lazy(() => import("@/components/portfolio/tiles/TileField"));

const Rails = () => (
  <div className="rails" aria-hidden>
    <div className="relative mx-auto h-full max-w-page px-3 md:px-5">
      <div className="h-full border-x border-border/60" />
    </div>
  </div>
);

const Index = () => {
  useReveal();

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="grain" aria-hidden />
      <Rails />
      <Suspense fallback={null}>
        <TileField />
      </Suspense>
      <Navbar />
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <CredentialsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
