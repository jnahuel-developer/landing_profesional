'use client';

import { useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const subscribeReady = () => () => {};
const clientReady = () => true;
const serverNotReady = () => false;
const serverPaused = () => true;
const isHidden = () => document.hidden;
const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function subscribeVisibility(callback: () => void) {
  document.addEventListener('visibilitychange', callback);
  return () => document.removeEventListener('visibilitychange', callback);
}
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change', callback);
  return () => media.removeEventListener('change', callback);
}

export function AcmeCarousel({
  scenes,
  label,
  chipsLabel,
  demo,
}: Readonly<{
  scenes: readonly {
    id: string;
    title: string;
    description: string;
    src: string;
    chips: readonly [string, string, string];
  }[];
  label: string;
  chipsLabel: string;
  demo: 'cafe' | 'logistics';
}>) {
  const t = useTranslations('Home.carousel');
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const ready = useSyncExternalStore(subscribeReady, clientReady, serverNotReady);
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const hidden = useSyncExternalStore(subscribeVisibility, isHidden, serverPaused);
  const reduced = useSyncExternalStore(subscribeMotion, isReduced, serverPaused);
  const [stopped, setStopped] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.35)),
      { threshold: 0.35 },
    );
    if (root.current) observer.observe(root.current.closest('article') ?? root.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const playing = visible && !hidden && !reduced && !stopped && !hover && !focus;
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % scenes.length),
      9000,
    );
    return () => window.clearInterval(timer);
  }, [playing, scenes.length]);

  function select(next: number) {
    const value = (next + scenes.length) % scenes.length;
    setStopped(true);
    setIndex(value);
    setAnnouncement(scenes[value]?.title ?? '');
  }

  return (
    <div
      ref={root}
      className="acme-carousel"
      role="region"
      aria-roledescription={t('role')}
      aria-label={label}
      tabIndex={ready ? 0 : undefined}
      onPointerDown={() => setStopped(true)}
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
        setStopped(true);
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
        {scenes.map((scene, position) => (
          <div
            key={scene.id}
            className="acme-scene"
            hidden={position !== index}
            aria-hidden={position !== index}
            inert={position !== index}
            role="group"
            aria-roledescription={t('scene')}
            aria-labelledby={`${id}-${scene.id}`}
          >
            <div className="acme-scene__image">
              {/* The localized caption supplies the meaning; embedded UI microtext is decorative. */}
              <Image
                src={scene.src}
                alt=""
                width={1600}
                height={900}
                sizes="(max-width: 959px) 100vw, (max-width: 1440px) 50vw, 640px"
                loading={position === 0 ? 'eager' : 'lazy'}
              />
            </div>
            <div className="acme-scene__caption">
              <strong id={`${id}-${scene.id}`}>{scene.title}</strong>
              <p>{scene.description}</p>
            </div>
            <ul className="demo-capabilities acme-scene__chips" aria-label={chipsLabel}>
              {scene.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="acme-carousel__dots" hidden={!ready}>
        {scenes.map((scene, position) => (
          <button
            key={scene.id}
            type="button"
            aria-label={t('goTo', { title: scene.title })}
            aria-pressed={index === position}
            onClick={() => select(position)}
            data-track-event="carousel_select"
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <span className="ui-sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      {!ready && (
        <div className="acme-carousel__fallback">
          <p>{t('withoutJs')}</p>
          <ol>
            {scenes.map((scene) => (
              <li key={scene.id}>
                {scene.title}: {scene.description} ({scene.chips.join(' · ')})
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
