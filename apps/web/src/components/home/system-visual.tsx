'use client';

import { motion, useReducedMotion, useSpring } from 'motion/react';
import { useTranslations } from 'next-intl';
import type { PointerEvent } from 'react';

const modules = ['sales', 'operations', 'mobile', 'data', 'inventory', 'routes'] as const;

export function SystemVisual() {
  const t = useTranslations('Home.visual');
  const reducedMotion = useReducedMotion();
  const x = useSpring(0, { damping: 24, stiffness: 180 });
  const y = useSpring(0, { damping: 24, stiffness: 180 });

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12);
    y.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 10);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <div
      aria-label={t('label')}
      className="system-visual"
      onPointerLeave={reset}
      onPointerMove={move}
      role="img"
      tabIndex={0}
    >
      <svg aria-hidden="true" className="system-visual__connections" viewBox="0 0 720 560">
        <path d="M360 280 175 130M360 280 360 90M360 280 555 145M360 280 165 405M360 280 370 475M360 280 575 390" />
        <circle cx="360" cy="280" r="100" />
      </svg>
      <motion.div className="system-visual__layer" style={{ x, y }}>
        <div className="system-core">
          <span>{t('coreEyebrow')}</span>
          <strong>{t('core')}</strong>
        </div>
        {modules.map((module) => (
          <article className={`system-module system-module--${module}`} key={module}>
            <span className="system-module__signal" />
            <strong>{t(`modules.${module}`)}</strong>
            <span>{t(`details.${module}`)}</span>
          </article>
        ))}
      </motion.div>
    </div>
  );
}
