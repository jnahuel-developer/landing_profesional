'use client';

import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';

import { isRouteActive, type AppRoute } from '../../config/routes';
import { Link, usePathname } from '../../i18n/navigation';

interface RouteLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  route: AppRoute;
}

export function RouteLink({ className, route, ...props }: RouteLinkProps) {
  const t = useTranslations('Routes');
  const pathname = usePathname();
  const active = isRouteActive(pathname, route.path);

  return (
    <Link
      aria-current={active ? 'page' : undefined}
      className={className}
      data-active={active || undefined}
      href={route.path}
      {...props}
    >
      {t(`${route.id}.label`)}
    </Link>
  );
}
