'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/** Decorative viewport state only: the server-rendered narrative is always complete. */
export function NarrativeJourney({
  children,
  className,
}: Readonly<{ children: ReactNode; className: string }>) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const steps = [...element.querySelectorAll<HTMLElement>('[data-journey-step]')];
    const panels = [...element.querySelectorAll<HTMLElement>('[data-scene-step]')];
    const visible = new Map<Element, number>();
    function activate(step: HTMLElement) {
      const index = steps.indexOf(step);
      for (const [position, item] of steps.entries()) {
        item.dataset.current = String(position === index);
        item.dataset.reached = String(position <= index);
      }
      for (const [position, panel] of panels.entries()) {
        panel.dataset.current = String(position === index);
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.set(entry.target, entry.intersectionRatio);
          else visible.delete(entry.target);
        }
        const focused = steps.find((step) => step.contains(document.activeElement));
        const hovered = steps.find((step) => step.matches(':hover'));
        const next = focused ?? hovered ?? [...visible].sort((a, b) => b[1] - a[1])[0]?.[0];
        if (next instanceof HTMLElement) activate(next);
      },
      { rootMargin: '-18% 0px -25% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    const highlight = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const step = target.closest<HTMLElement>('[data-journey-step]');
      if (step && element.contains(step)) activate(step);
    };
    steps.forEach((step) => observer.observe(step));
    element.addEventListener('focusin', highlight);
    element.addEventListener('pointerover', highlight);
    return () => {
      observer.disconnect();
      element.removeEventListener('focusin', highlight);
      element.removeEventListener('pointerover', highlight);
    };
  }, []);

  return (
    <div className={className} ref={root}>
      {children}
    </div>
  );
}
