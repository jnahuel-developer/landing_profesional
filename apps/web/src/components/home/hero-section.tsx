import { useTranslations } from 'next-intl';

import { routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';
import { ProgressiveReveal } from '../motion/progressive-reveal';
import { SystemVisual } from './system-visual';

export function HeroSection() {
  const t = useTranslations('Home.hero');
  const capabilities = ['product', 'architecture', 'development', 'operations'] as const;
  return (
    <section aria-labelledby="home-title" className="narrative-section hero-section" id="home">
      <ProgressiveReveal>
        <div className="hero-section__grid">
          <div className="hero-copy">
            <p className="narrative-section__eyebrow">{t('eyebrow')}</p>
            <h1 id="home-title">{t('title')}</h1>
            <p className="hero-copy__description">{t('description')}</p>
            <div className="hero-actions">
              <Link
                className="inline-action"
                data-track-event="cta_select"
                data-track-target="laboratory"
                href={routes.laboratory.path}
              >
                {t('primaryCta')}
              </Link>
              <Link
                className="inline-action inline-action--secondary"
                data-track-event="cta_select"
                data-track-target="contact"
                href="/#contact"
              >
                {t('secondaryCta')}
              </Link>
            </div>
            <ul aria-label={t('capabilitiesLabel')} className="hero-capabilities">
              {capabilities.map((capability) => (
                <li key={capability}>{t(`capabilities.${capability}`)}</li>
              ))}
            </ul>
          </div>
          <SystemVisual />
        </div>
      </ProgressiveReveal>
    </section>
  );
}
