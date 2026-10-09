import type { Locale } from '../i18n/routing';

export type AppPath = `/${string}`;
export type SectionId = 'home' | 'solutions' | 'experience' | 'process' | 'about' | 'contact';
export type DocumentRouteId = 'privacy' | 'laboratory' | 'admin';
export type RouteId = SectionId | DocumentRouteId;

export interface SectionRoute {
  readonly id: SectionId;
  readonly kind: 'section';
  readonly hash: `#${SectionId}`;
  readonly path: '/';
}

export interface DocumentRoute {
  readonly id: DocumentRouteId;
  readonly kind: 'document' | 'lab' | 'internal';
  readonly path: AppPath;
}

export type AppRoute = SectionRoute | DocumentRoute;

export const sections = [
  { id: 'home', kind: 'section', hash: '#home', path: '/' },
  { id: 'solutions', kind: 'section', hash: '#solutions', path: '/' },
  { id: 'experience', kind: 'section', hash: '#experience', path: '/' },
  { id: 'process', kind: 'section', hash: '#process', path: '/' },
  { id: 'about', kind: 'section', hash: '#about', path: '/' },
  { id: 'contact', kind: 'section', hash: '#contact', path: '/' },
] as const satisfies readonly SectionRoute[];

export const routes = {
  home: sections[0],
  solutions: sections[1],
  experience: sections[2],
  process: sections[3],
  about: sections[4],
  contact: sections[5],
  privacy: { id: 'privacy', kind: 'document', path: '/privacidad' },
  laboratory: { id: 'laboratory', kind: 'lab', path: '/lab' },
  admin: { id: 'admin', kind: 'internal', path: '/admin' },
} as const satisfies Record<RouteId, AppRoute>;

export const documents = [routes.privacy, routes.laboratory, routes.admin] as const;
export const appRoutes = [...sections, ...documents] as const;
export const primaryRoutes = sections;
export const secondaryRoutes = [routes.privacy] as const;
export const footerRoutes = [routes.contact, routes.laboratory, routes.privacy] as const;

const legacySlugs: Record<Locale, Partial<Record<string, SectionId>>> = {
  es: {
    soluciones: 'solutions',
    experiencia: 'experience',
    'como-trabajo': 'process',
    'sobre-mi': 'about',
    contacto: 'contact',
  },
  en: {
    soluciones: 'solutions',
    solutions: 'solutions',
    experiencia: 'experience',
    experience: 'experience',
    'como-trabajo': 'process',
    'how-i-work': 'process',
    'sobre-mi': 'about',
    about: 'about',
    contacto: 'contact',
    contact: 'contact',
  },
};

export function getSectionRoute(id: SectionId) {
  return routes[id];
}

export function getSectionHref(id: SectionId) {
  return `${routes.home.path}${routes[id].hash}` as const;
}

export function getLocalizedSectionHref(locale: Locale, id: SectionId) {
  const prefix = locale === 'en' ? '/en' : '';
  return `${prefix || '/'}${routes[id].hash}`;
}

export function findLegacySection(locale: Locale, segments: readonly string[]) {
  return segments.length === 1 ? legacySlugs[locale][segments[0] ?? ''] : undefined;
}

export function isDocumentActive(pathname: string | null, path: AppPath) {
  if (!pathname) return false;
  return pathname === path || pathname.startsWith(`${path}/`);
}
