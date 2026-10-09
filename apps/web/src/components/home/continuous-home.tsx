import { ScrollProgress } from '../motion/scroll-progress';
import { FinalSections } from './final-sections';
import { HeroSection } from './hero-section';
import { SolutionsSection, ExperienceSection, ProcessSection } from './business-sections';

export function ContinuousHome() {
  return (
    <div className="continuous-home">
      <ScrollProgress />
      <HeroSection />
      <SolutionsSection />
      <ExperienceSection />
      <ProcessSection />
      <FinalSections />
    </div>
  );
}
