'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { sections, type SectionId } from '../../config/routes';
import { usePathname } from '../../i18n/navigation';

const SectionNavigationContext = createContext<SectionId>('home');

function isSectionId(value: string): value is SectionId {
  return sections.some(({ id }) => id === value);
}

export function SectionNavigationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  useEffect(() => {
    if (pathname !== '/') return;

    const header = document.querySelector<HTMLElement>('.public-header');
    const headerOffset = (header?.offsetHeight ?? 68) + 16;
    const visible = new Map<SectionId, IntersectionObserverEntry>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!isSectionId(id)) continue;
          if (entry.isIntersecting) visible.set(id, entry);
          else visible.delete(id);
        }

        const candidates = [...visible.entries()].sort(([, left], [, right]) => {
          const leftDistance = Math.abs(left.boundingClientRect.top - headerOffset);
          const rightDistance = Math.abs(right.boundingClientRect.top - headerOffset);
          return leftDistance - rightDistance || right.intersectionRatio - left.intersectionRatio;
        });
        const next = candidates[0]?.[0];
        if (!next) return;
        setActiveSection((current) => {
          if (current === next) return current;
          const url = new URL(window.location.href);
          url.hash = next;
          window.history.replaceState(window.history.state, '', url);
          return next;
        });
      },
      {
        rootMargin: `-${headerOffset}px 0px -48% 0px`,
        threshold: [0, 0.15, 0.35, 0.6],
      },
    );

    for (const { id } of sections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => observer.disconnect();
  }, [pathname]);

  const value = useMemo(() => activeSection, [activeSection]);
  return <SectionNavigationContext value={value}>{children}</SectionNavigationContext>;
}

export function useActiveSection() {
  return useContext(SectionNavigationContext);
}
