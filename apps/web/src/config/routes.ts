export type RouteKind = 'primary' | 'secondary' | 'lab' | 'internal';
export type AppPath = `/${string}`;

export interface AppRoute {
  readonly description: string;
  readonly kind: RouteKind;
  readonly label: string;
  readonly path: AppPath;
  readonly title: string;
}

export const routes = {
  home: {
    description: 'Presentación provisional del portfolio profesional.',
    kind: 'primary',
    label: 'Inicio',
    path: '/',
    title: 'Nahuel Martínez',
  },
  solutions: {
    description: 'Contenido provisional sobre las áreas de solución.',
    kind: 'primary',
    label: 'Soluciones',
    path: '/soluciones',
    title: 'Soluciones',
  },
  experience: {
    description: 'Contenido provisional sobre experiencia y casos.',
    kind: 'primary',
    label: 'Experiencia',
    path: '/experiencia',
    title: 'Experiencia',
  },
  process: {
    description: 'Contenido provisional sobre la metodología de trabajo.',
    kind: 'primary',
    label: 'Cómo trabajo',
    path: '/como-trabajo',
    title: 'Cómo trabajo',
  },
  about: {
    description: 'Contenido provisional sobre el perfil profesional.',
    kind: 'primary',
    label: 'Sobre mí',
    path: '/sobre-mi',
    title: 'Sobre mí',
  },
  contact: {
    description: 'Contenido provisional para iniciar una conversación profesional.',
    kind: 'primary',
    label: 'Contacto',
    path: '/contacto',
    title: 'Contacto',
  },
  privacy: {
    description: 'Información provisional sobre privacidad y tratamiento de datos.',
    kind: 'secondary',
    label: 'Privacidad',
    path: '/privacidad',
    title: 'Privacidad',
  },
  laboratory: {
    description: 'Estructura preliminar del laboratorio, sin demos ni sesiones activas.',
    kind: 'lab',
    label: 'Laboratorio',
    path: '/lab',
    title: 'Laboratorio',
  },
  admin: {
    description: 'Estructura técnica preliminar, sin autenticación, métricas ni datos reales.',
    kind: 'internal',
    label: 'Administración',
    path: '/admin',
    title: 'Administración',
  },
} as const satisfies Record<string, AppRoute>;

export const appRoutes = Object.values(routes);
export const primaryRoutes = appRoutes.filter((route) => route.kind === 'primary');
export const secondaryRoutes = appRoutes.filter((route) => route.kind === 'secondary');

export function isRouteActive(pathname: string, path: AppPath) {
  if (path === '/') return pathname === path;
  return pathname === path || pathname.startsWith(`${path}/`);
}
