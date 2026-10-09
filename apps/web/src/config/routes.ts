export type RouteKind = 'primary' | 'secondary' | 'lab' | 'internal';
export type AppPath = `/${string}`;
export type RouteId =
  | 'home'
  | 'solutions'
  | 'experience'
  | 'process'
  | 'about'
  | 'contact'
  | 'privacy'
  | 'laboratory'
  | 'admin';

export interface AppRoute {
  readonly id: RouteId;
  readonly kind: RouteKind;
  readonly path: AppPath;
}

export const routes = {
  home: {
    id: 'home',
    kind: 'primary',
    path: '/',
  },
  solutions: {
    id: 'solutions',
    kind: 'primary',
    path: '/soluciones',
  },
  experience: {
    id: 'experience',
    kind: 'primary',
    path: '/experiencia',
  },
  process: {
    id: 'process',
    kind: 'primary',
    path: '/como-trabajo',
  },
  about: {
    id: 'about',
    kind: 'primary',
    path: '/sobre-mi',
  },
  contact: {
    id: 'contact',
    kind: 'primary',
    path: '/contacto',
  },
  privacy: {
    id: 'privacy',
    kind: 'secondary',
    path: '/privacidad',
  },
  laboratory: {
    id: 'laboratory',
    kind: 'lab',
    path: '/lab',
  },
  admin: {
    id: 'admin',
    kind: 'internal',
    path: '/admin',
  },
} as const satisfies Record<string, AppRoute>;

export const appRoutes = Object.values(routes);
export const primaryRoutes = appRoutes.filter((route) => route.kind === 'primary');
export const secondaryRoutes = appRoutes.filter((route) => route.kind === 'secondary');
export const footerRoutes = [routes.contact, ...secondaryRoutes];

export function isRouteActive(pathname: string | null, path: AppPath) {
  if (!pathname) return false;
  if (path === '/') return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}
