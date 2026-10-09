import { useTranslations } from 'next-intl';
import { Link } from '../i18n/navigation';

export const privacyTopics = [
  'responsible',
  'contact',
  'preferences',
  'analytics',
  'demos',
  'excluded',
  'recipients',
  'retention',
  'rights',
  'review',
] as const;

export function PrivacyDocument() {
  const t = useTranslations('Privacy');
  const routes = useTranslations('Routes');
  return (
    <article className="public-document" aria-labelledby="privacy-title">
      <p className="narrative-section__eyebrow">{t('eyebrow')}</p>
      <h1 id="privacy-title">{routes('privacy.title')}</h1>
      <p className="section-lead">{t('introduction')}</p>
      {privacyTopics.map((topic) => (
        <div key={topic} className="privacy-topic">
          <h2>{t(`topics.${topic}.title`)}</h2>
          <p>{t(`topics.${topic}.body`)}</p>
        </div>
      ))}
      <Link href="/#contact">{t('contactLink')}</Link>
    </article>
  );
}

export function LaboratoryDocument() {
  const t = useTranslations('Laboratory');
  const demos = useTranslations('Home.experience');
  const routes = useTranslations('Routes');
  return (
    <div className="public-document laboratory-document" data-track-event="lab_opened">
      <div className="section-introduction">
        <p className="narrative-section__eyebrow">{t('eyebrow')}</p>
        <h1>{routes('laboratory.title')}</h1>
        <p className="section-lead">{t('introduction')}</p>
      </div>
      <div className="experience-cards">
        {(['cafe', 'logistics'] as const).map((demo) => (
          <article
            className={`experience-card experience-card--${demo}`}
            key={demo}
            aria-labelledby={`lab-${demo}`}
          >
            <p className="demo-disclosure">{demos('disclosure')}</p>
            <h2 id={`lab-${demo}`}>{demos(`demos.${demo}.name`)}</h2>
            <p className="lab-availability">{t('soon')}</p>
            <p>{t(`demos.${demo}`)}</p>
            <ul className="demo-capabilities">
              {(['one', 'two', 'three'] as const).map((key) => (
                <li key={key}>{demos(`demos.${demo}.capabilities.${key}`)}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p>{t('availability')}</p>
      <div className="error-actions">
        <Link
          className="inline-action"
          href="/#contact"
          data-track-event="cta_select"
          data-track-target="contact"
        >
          {t('contact')}
        </Link>
        <Link className="inline-action inline-action--secondary" href="/">
          {t('home')}
        </Link>
      </div>
    </div>
  );
}
