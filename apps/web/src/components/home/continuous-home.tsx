import { useTranslations } from 'next-intl';

import { sections } from '../../config/routes';
import { ProgressiveReveal } from '../motion/progressive-reveal';
import { ScrollProgress } from '../motion/scroll-progress';
import { HeroSection } from './hero-section';

export function ContinuousHome() {
  const t = useTranslations('Home');
  return (
    <div className="continuous-home">
      <ScrollProgress />
      <HeroSection />
      {sections.slice(1).map(({ id }) => (
        <section
          aria-labelledby={`${id}-title`}
          className="narrative-section"
          data-section={id}
          id={id}
          key={id}
        >
          <div className="narrative-section__content">
            <ProgressiveReveal>
              <p className="narrative-section__eyebrow">{t(`sections.${id}.eyebrow`)}</p>
              <h2 id={`${id}-title`}>{t(`sections.${id}.title`)}</h2>
              <p>{t(`sections.${id}.description`)}</p>
            </ProgressiveReveal>
          </div>
        </section>
      ))}
    </div>
  );
}
