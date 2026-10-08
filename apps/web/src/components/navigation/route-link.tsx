'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps } from 'react';

import { isRouteActive, type AppRoute } from '../../config/routes';

interface RouteLinkProps extends Omit<ComponentProps<typeof Link>, 'href'> {
  route: AppRoute;
}

export function RouteLink({ className, route, ...props }: RouteLinkProps) {
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
      {route.label}
    </Link>
  );
}
