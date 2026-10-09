'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslations } from 'next-intl';

export function AcmeCarousel({
  children,
  titles,
  label,
  demo,
}: Readonly<{
  children: ReactNode[];
  titles: string[];
  label: string;
  demo: 'cafe' | 'logistics';
}>) {
  const t = useTranslations('Home.carousel');
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [reduced, setReduced] = useState(true);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    setReady(true);
    updateMotion();
    updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting)),
      { threshold: 0.35 },
    );
    if (root.current) observer.observe(root.current);
    return () => {
      observer.disconnect();
      media.removeEventListener('change', updateMotion);
      document.removeEventListener('visibilitychange', updateVisibility);
    };
  }, []);

  const playing = visible && !hidden && !reduced && !paused && !hover && !focus;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % titles.length),
      9000,
    );
    return () => window.clearInterval(timer);
  }, [playing, titles.length]);

  function select(next: number) {
    const value = (next + titles.length) % titles.length;
    setPaused(true);
    setIndex(value);
    setAnnouncement(`${value + 1} / ${titles.length}: ${titles[value]}`);
  }

  return (
    <div
      ref={root}
      className="acme-carousel"
      role="region"
      aria-roledescription={t('role')}
      aria-label={label}
      data-playing={playing}
      data-track-demo={demo}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocusCapture={() => setFocus(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocus(false);
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault();
          select(index + (event.key === 'ArrowRight' ? 1 : -1));
        }
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0];
        if (touch) start.current = { x: touch.clientX, y: touch.clientY };
        setPaused(true);
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0];
        const origin = start.current;
        start.current = null;
        if (!touch || !origin) return;
        const dx = touch.clientX - origin.x;
        const dy = touch.clientY - origin.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
          select(index + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="acme-carousel__viewport">
        {children.map((child, position) => (
          <div
            key={titles[position]}
            hidden={position !== index}
            role="group"
            aria-roledescription={t('scene')}
            aria-label={`${position + 1} / ${titles.length}: ${titles[position]}`}
          >
            {child}
          </div>
        ))}
      </div>
      <div className="acme-carousel__controls" hidden={!ready}>
        <button
          type="button"
          aria-label={t('previous')}
          onClick={() => select(index - 1)}
          data-track-event="carousel_select"
        >
          ←
        </button>
        <span aria-hidden="true">
          {index + 1} / {titles.length}
        </span>
        <button
          type="button"
          aria-label={t('next')}
          onClick={() => select(index + 1)}
          data-track-event="carousel_select"
        >
          →
        </button>
        <button
          type="button"
          aria-pressed={paused}
          disabled={reduced}
          onClick={() => setPaused((value) => !value)}
          data-track-event="carousel_pause"
        >
          {paused ? t('resume') : t('pause')}
        </button>
      </div>
      <div className="acme-carousel__dots" hidden={!ready}>
        {titles.map((title, position) => (
          <button
            key={title}
            type="button"
            aria-label={t('goTo', { title })}
            aria-pressed={index === position}
            onClick={() => select(position)}
            data-track-event="carousel_select"
          >
            <span aria-hidden="true">●</span>
          </button>
        ))}
      </div>
      <span className="ui-sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      <noscript>
        <p>{t('withoutJs')}</p>
        <ol>
          {titles.map((title) => (
            <li key={title}>{title}</li>
          ))}
        </ol>
      </noscript>
    </div>
  );
}
