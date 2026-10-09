import { useTranslations } from 'next-intl';
import { CheckIcon } from '@portfolio/ui';

import { routes } from '../../config/routes';
import { Link } from '../../i18n/navigation';
import { ProgressiveReveal } from '../motion/progressive-reveal';
import { NarrativeJourney } from './narrative-journey';

export const solutionAreas = [
  'commerce',
  'operations',
  'applications',
  'automation',
  'intelligence',
] as const;
export const processStages = ['understand', 'define', 'build', 'evolve'] as const;
const demos = ['cafe', 'logistics'] as const;

function SectionIntroduction({
  section,
}: Readonly<{ section: 'solutions' | 'experience' | 'process' }>) {
  const t = useTranslations('Home.sections');
  return (
    <ProgressiveReveal>
      <p className="narrative-section__eyebrow">{t(`${section}.eyebrow`)}</p>
      <h2 id={`${section}-title`}>{t(`${section}.title`)}</h2>
      <p className="section-lead">{t(`${section}.description`)}</p>
    </ProgressiveReveal>
  );
}

function ContactAction({ section }: Readonly<{ section: 'solutions' | 'process' }>) {
  const t = useTranslations('Home');
  return (
    <Link
      className="inline-action"
      data-track-event="cta_select"
      data-track-target="contact"
      href="/#contact"
    >
      {t(`${section}.cta`)}
    </Link>
  );
}

export function SolutionsSection() {
  const t = useTranslations('Home.solutions');
  return (
    <section
      aria-labelledby="solutions-title"
      className="narrative-section solutions-section"
      data-section="solutions"
      id="solutions"
    >
      <div className="section-introduction">
        <SectionIntroduction section="solutions" />
      </div>
      <NarrativeJourney className="solutions-journey">
        <div className="capability-scene" aria-hidden="true">
          <p className="narrative-section__eyebrow">{t('sceneLabel')}</p>
          <strong className="capability-scene__core">{t('sceneCore')}</strong>
          <div className="capability-scene__nodes">
            {solutionAreas.map((area, index) => (
              <div className="capability-node" data-scene-step={area} key={area}>
                <span className="journey-number">0{index + 1}</span>
                <div>
                  <strong>{t(`areas.${area}.title`)}</strong>
                  <p>{t(`areas.${area}.result`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="capability-path">
          {solutionAreas.map((area, index) => (
            <ProgressiveReveal key={area}>
              <article
                className="capability-entry"
                data-journey-step={area}
                tabIndex={0}
                aria-labelledby={`solution-${area}`}
              >
                <span className="journey-number" aria-hidden="true">
                  0{index + 1}
                </span>
                <div>
                  <h3 id={`solution-${area}`}>{t(`areas.${area}.title`)}</h3>
                  <p>{t(`areas.${area}.problem`)}</p>
                  <p>{t(`areas.${area}.solution`)}</p>
                  <p className="entry-result">
                    <CheckIcon />
                    {t(`areas.${area}.result`)}
                  </p>
                  <p className="entry-examples">
                    <strong>{t('examplesLabel')}</strong> {t(`areas.${area}.examples`)}
                  </p>
                </div>
              </article>
            </ProgressiveReveal>
          ))}
          <ContactAction section="solutions" />
        </div>
      </NarrativeJourney>
    </section>
  );
}

function DemoMark({ demo }: Readonly<{ demo: (typeof demos)[number] }>) {
  return (
    <svg
      aria-hidden="true"
      className="demo-mark"
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {demo === 'cafe' ? (
        <>
          <path d="M6 10h17v9a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7ZM23 12h2a4 4 0 0 1 0 8h-2M5 29h20M11 3v3M17 2v4" />
        </>
      ) : (
        <>
          <path d="M3 7h17v16H3ZM20 13h5l4 5v5h-9M23 14v5h6" />
          <circle cx="9" cy="25" r="3" />
          <circle cx="24" cy="25" r="3" />
        </>
      )}
    </svg>
  );
}

function DemoPreview({ demo }: Readonly<{ demo: (typeof demos)[number] }>) {
  const t = useTranslations('Home.experience');
  return (
    <div className="demo-preview" role="img" aria-label={t(`demos.${demo}.previewLabel`)}>
      <ProgressiveReveal>
        <div className="demo-preview__header" aria-hidden="true">
          <span className="demo-signal" />
          <strong>{t(`demos.${demo}.previewTitle`)}</strong>
          <span>{t('previewBadge')}</span>
        </div>
        <div className="demo-preview__body" aria-hidden="true">
          {demo === 'cafe' ? (
            <div className="demo-bars">
              {[35, 58, 44, 72, 61, 88, 76].map((height, index) => (
                <span key={index} style={{ height: `${height}%` }} />
              ))}
            </div>
          ) : (
            <svg className="demo-route" viewBox="0 0 260 110" fill="none">
              <path d="M20 85 70 60 115 75 160 25 235 40" stroke="currentColor" strokeWidth="3" />
              {[
                [20, 85],
                [70, 60],
                [115, 75],
                [160, 25],
                [235, 40],
              ].map(([cx, cy], index) => (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r="6"
                  fill="var(--ui-color-surface-raised)"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              ))}
            </svg>
          )}
          <div className="demo-preview__labels">
            <span>{t(`demos.${demo}.signalOne`)}</span>
            <span>
              <CheckIcon />
              {t(`demos.${demo}.signalTwo`)}
            </span>
          </div>
        </div>
      </ProgressiveReveal>
      <ProgressiveReveal>
        <div className="demo-preview__event" aria-hidden="true">
          <CheckIcon />
          <span>{t(`demos.${demo}.event`)}</span>
        </div>
      </ProgressiveReveal>
    </div>
  );
}

export function ExperienceSection() {
  const t = useTranslations('Home.experience');
  return (
    <section
      aria-labelledby="experience-title"
      className="narrative-section experience-section"
      data-section="experience"
      id="experience"
    >
      <div className="section-introduction">
        <SectionIntroduction section="experience" />
      </div>
      <div className="experience-cards">
        {demos.map((demo) => (
          <ProgressiveReveal key={demo}>
            <article
              className={`experience-card experience-card--${demo}`}
              aria-labelledby={`demo-${demo}`}
            >
              <div className="experience-card__identity">
                <DemoMark demo={demo} />
                <div>
                  <p className="demo-disclosure">{t('disclosure')}</p>
                  <h3 id={`demo-${demo}`}>{t(`demos.${demo}.name`)}</h3>
                </div>
              </div>
              <p>{t(`demos.${demo}.description`)}</p>
              <DemoPreview demo={demo} />
              <ul className="demo-capabilities" aria-label={t('capabilitiesLabel')}>
                {(['one', 'two', 'three'] as const).map((key) => (
                  <li key={key}>{t(`demos.${demo}.capabilities.${key}`)}</li>
                ))}
              </ul>
              <Link
                className="demo-link"
                data-track-event="cta_select"
                data-track-target="laboratory"
                href={routes.laboratory.path}
              >
                {t(`demos.${demo}.link`)} <span aria-hidden="true">↗</span>
              </Link>
            </article>
          </ProgressiveReveal>
        ))}
      </div>
      <div className="experience-next">
        <p>{t('availability')}</p>
        <Link
          className="inline-action"
          data-track-event="cta_select"
          data-track-target="laboratory"
          href={routes.laboratory.path}
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}

export function ProcessSection() {
  const t = useTranslations('Home.process');
  return (
    <section
      aria-labelledby="process-title"
      className="narrative-section process-section"
      data-section="process"
      id="process"
    >
      <NarrativeJourney className="process-journey">
        <div className="process-introduction">
          <SectionIntroduction section="process" />
          <p className="process-collaboration">{t('collaboration')}</p>
          <ContactAction section="process" />
        </div>
        <ol className="process-path">
          {processStages.map((stage, index) => (
            <li className="process-stage" data-journey-step={stage} key={stage}>
              <ProgressiveReveal>
                <article tabIndex={0} aria-labelledby={`process-${stage}`}>
                  <span className="process-node" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3 id={`process-${stage}`}>{t(`stages.${stage}.title`)}</h3>
                  <p>{t(`stages.${stage}.work`)}</p>
                  <dl>
                    <div className="stage-deliverable">
                      <dt>{t('deliverableLabel')}</dt>
                      <dd>{t(`stages.${stage}.deliverable`)}</dd>
                    </div>
                    <div>
                      <dt>{t('clientLabel')}</dt>
                      <dd>{t(`stages.${stage}.client`)}</dd>
                    </div>
                    <div>
                      <dt>{t('professionalLabel')}</dt>
                      <dd>{t(`stages.${stage}.professional`)}</dd>
                    </div>
                  </dl>
                </article>
              </ProgressiveReveal>
            </li>
          ))}
        </ol>
      </NarrativeJourney>
    </section>
  );
}
