import { useTranslations } from 'next-intl';

import { sections } from '../../config/routes';

export function ContinuousHome() {
  const t = useTranslations('Home');
  return (
    <div className="continuous-home">
      {sections.map(({ id }, index) => (
        <section
          aria-labelledby={`${id}-title`}
          className="narrative-section"
          data-section={id}
          id={id}
          key={id}
        >
          <div className="narrative-section__content">
            <p className="narrative-section__eyebrow">{t(`sections.${id}.eyebrow`)}</p>
            {index === 0 ? (
              <h1 id={`${id}-title`}>{t(`sections.${id}.title`)}</h1>
            ) : (
              <h2 id={`${id}-title`}>{t(`sections.${id}.title`)}</h2>
            )}
            <p>{t(`sections.${id}.description`)}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
