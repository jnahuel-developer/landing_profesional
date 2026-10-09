'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { sections, type SectionId } from '../../config/routes';
import { usePathname } from '../../i18n/navigation';

const SectionNavigationContext = createContext<SectionId>('home');

function isSectionId(value: string): value is SectionId {
  return sections.some(({ id }) => id === value);
}

export function SectionNavigationProvider({ children }: Readonly<{ children: ReactNode }>) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const pendingSection = useRef<SectionId | null>(null);
  const navigationLock = useRef<SectionId | null>(null);
  const programmaticScroll = useRef(false);

  useEffect(() => {
    if (pathname !== '/') return;

    const header = document.querySelector<HTMLElement>('.public-header');
    const headerOffset = (header?.offsetHeight ?? 68) + 16;
    const visible = new Map<SectionId, IntersectionObserverEntry>();

    const getSectionFromHash = (hash: string): SectionId | null => {
      const sectionId = hash.startsWith('#') ? hash.slice(1) : '';
      return isSectionId(sectionId) ? sectionId : null;
    };

    const requestSection = (sectionId: SectionId, scroll: boolean, lock = true) => {
      visible.clear();
      pendingSection.current = lock ? sectionId : null;
      navigationLock.current = lock ? sectionId : null;
      programmaticScroll.current = true;
      setActiveSection(sectionId);
      window.requestAnimationFrame(() => {
        if (scroll) document.getElementById(sectionId)?.scrollIntoView();
        window.requestAnimationFrame(() => {
          programmaticScroll.current = false;
        });
      });
    };

    const syncRequestedSection = (lock = true) => {
      const hash = window.location.hash;
      const sectionId = getSectionFromHash(hash);
      if (sectionId) {
        requestSection(sectionId, true, lock);
      } else {
        pendingSection.current = null;
        setActiveSection('home');
      }
    };

    syncRequestedSection(window.location.hash !== '#home');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!isSectionId(id)) continue;
          if (entry.isIntersecting) visible.set(id, entry);
          else visible.delete(id);
        }

        const pending = pendingSection.current;
        const locked = navigationLock.current;
        if (pending || locked) {
          const target = pending ?? locked;
          const targetEntry = target ? visible.get(target) : undefined;
          if (target && targetEntry) {
            pendingSection.current = null;
            setActiveSection(target);
          }
          return;
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

    const handleHistoryNavigation = () => syncRequestedSection();
    const handleExplicitSectionNavigation = (event: Event) => {
      const sectionId = (event as CustomEvent<SectionId>).detail;
      if (isSectionId(sectionId)) requestSection(sectionId, true);
    };
    const handleScroll = () => {
      if (programmaticScroll.current) return;
      const locked = navigationLock.current;
      if (!locked) return;
      const target = document.getElementById(locked);
      if (target) {
        const bounds = target.getBoundingClientRect();
        if (bounds.bottom > headerOffset && bounds.top < window.innerHeight) return;
      }
      navigationLock.current = null;
      pendingSection.current = null;
    };

    window.addEventListener('hashchange', handleHistoryNavigation);
    window.addEventListener('popstate', handleHistoryNavigation);
    window.addEventListener('section-navigation', handleExplicitSectionNavigation);
    window.addEventListener('scroll', handleScroll, { passive: true });

    for (const { id } of sections) {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    }
    return () => {
      observer.disconnect();
      window.removeEventListener('hashchange', handleHistoryNavigation);
      window.removeEventListener('popstate', handleHistoryNavigation);
      window.removeEventListener('section-navigation', handleExplicitSectionNavigation);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  const value = useMemo(() => activeSection, [activeSection]);
  return <SectionNavigationContext value={value}>{children}</SectionNavigationContext>;
}

export function useActiveSection() {
  return useContext(SectionNavigationContext);
}
