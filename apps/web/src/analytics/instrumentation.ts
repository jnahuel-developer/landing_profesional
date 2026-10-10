import { commercialSections, destinations, type AnalyticsAction } from '@portfolio/contracts';
import { analytics, browserDimensions } from './client';

export function observePublicBehavior() {
  const timers = new Map<Element, ReturnType<typeof setTimeout>>();
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        clearTimeout(timers.get(entry.target));
        timers.delete(entry.target);
        const visible =
          entry.isIntersecting &&
          entry.intersectionRect.height >=
            Math.min(entry.boundingClientRect.height, window.innerHeight) * 0.35;
        const section = commercialSections.find((id) => id === entry.target.id);
        if (visible && section && !document.hidden)
          timers.set(
            entry.target,
            setTimeout(() => {
              if (!document.hidden)
                analytics.track({ name: 'section_viewed', properties: { section } });
              timers.delete(entry.target);
            }, 1000),
          );
      }
    },
    { threshold: [0, 0.01, 0.025, 0.05, 0.1, 0.15, 0.2, 0.35, 0.5, 1] },
  );
  for (const id of commercialSections) {
    const element = document.getElementById(id);
    if (element) observer.observe(element);
  }
  function click(event: MouseEvent) {
    if (event.button !== 0 || !(event.target instanceof Element)) return;
    const anchor = event.target.closest<HTMLAnchorElement>('a[href]');
    if (!anchor) return;
    const dimensions = browserDimensions();
    if (!dimensions) return;
    const location = anchor.closest('header')
      ? 'header'
      : anchor.closest('footer')
        ? 'footer'
        : (commercialSections.find((id) => id === anchor.closest('section[id]')?.id) ??
          dimensions.page);
    const target = anchor.dataset.trackTarget;
    if (
      anchor.dataset.trackEvent === 'cta_select' &&
      (target === 'contact' || target === 'laboratory')
    )
      analytics.track({ name: 'cta_clicked', properties: { location, destination: target } });
    else if (
      anchor.closest('nav, header, footer') ||
      anchor.dataset.trackEvent === 'navigation_select'
    ) {
      const url = new URL(anchor.href);
      if (url.origin === window.location.origin) {
        const destination =
          destinations.find((value) => value === url.hash.slice(1)) ??
          (url.pathname.endsWith('/lab')
            ? 'laboratory'
            : url.pathname.endsWith('/privacidad')
              ? 'privacy'
              : /^\/(en\/?)?$/.test(url.pathname)
                ? 'home'
                : null);
        if (destination)
          analytics.track({
            name: 'navigation_used',
            properties: { origin: location, destination },
          });
      }
    }
    const company = anchor.dataset.trackCompany;
    if (company === 'cafe' || company === 'logistics')
      analytics.track({ name: 'demo_card_selected', properties: { company, location } });
  }
  function hidden() {
    if (!document.hidden) {
      for (const id of commercialSections) {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
          observer.observe(element);
        }
      }
      return;
    }
    for (const timer of timers.values()) clearTimeout(timer);
    timers.clear();
    if (navigator.sendBeacon) analytics.beacon((url, body) => navigator.sendBeacon(url, body));
  }
  document.addEventListener('click', click);
  document.addEventListener('visibilitychange', hidden);
  return () => {
    observer.disconnect();
    for (const timer of timers.values()) clearTimeout(timer);
    document.removeEventListener('click', click);
    document.removeEventListener('visibilitychange', hidden);
  };
}
export function trackManualCarousel(
  company: 'cafe' | 'logistics',
  scene: number,
  method: Extract<AnalyticsAction, { name: 'carousel_changed' }>['properties']['method'],
) {
  analytics.track({ name: 'carousel_changed', properties: { company, scene, method } });
}
