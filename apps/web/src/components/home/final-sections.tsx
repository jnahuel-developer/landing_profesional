import { useTranslations } from 'next-intl';
import { ContactForm } from './contact-form';

export function FinalSections() {
  const t = useTranslations('Home');
  return (
    <>
      <section
        id="about"
        data-section="about"
        aria-labelledby="about-title"
        className="narrative-section about-section"
      >
        <div className="narrative-section__content">
          <p className="narrative-section__eyebrow">{t('sections.about.eyebrow')}</p>
          <h2 id="about-title">{t('sections.about.title')}</h2>
          <p className="section-lead">{t('sections.about.description')}</p>
          <p>{t('about.approach')}</p>
          <p>{t('about.responsibility')}</p>
          <p>{t('about.collaboration')}</p>
        </div>
      </section>
      <section
        id="contact"
        data-section="contact"
        aria-labelledby="contact-title"
        className="narrative-section contact-section"
      >
        <div className="narrative-section__content">
          <p className="narrative-section__eyebrow">{t('sections.contact.eyebrow')}</p>
          <h2 id="contact-title">{t('sections.contact.title')}</h2>
          <p className="section-lead">{t('sections.contact.description')}</p>
          <p>{t('contact.context')}</p>
        </div>
        <ContactForm />
      </section>
    </>
  );
}
