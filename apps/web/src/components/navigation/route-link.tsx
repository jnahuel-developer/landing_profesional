'use client';

import { useTranslations } from 'next-intl';
import type { ComponentProps, MouseEvent } from 'react';

import { getSectionHref, isDocumentActive, type AppRoute } from '../../config/routes';
import { Link, usePathname } from '../../i18n/navigation';
import { useActiveSection } from './section-navigation';

interface RouteLinkProps extends Omit<ComponentProps<typeof Link>, 'href' | 'children'> {
  route: AppRoute;
}

export function RouteLink({ className, route, ...props }: RouteLinkProps) {
  const t = useTranslations('Routes');
  const pathname = usePathname();
  const activeSection = useActiveSection();
  const active =
    route.kind === 'section'
      ? pathname === '/' && activeSection === route.id
      : isDocumentActive(pathname, route.path);
  const href = route.kind === 'section' ? getSectionHref(route.id) : route.path;
  const sectionClick = (event: MouseEvent<HTMLAnchorElement>) => {
    props.onClick?.(event);
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      route.kind !== 'section' ||
      pathname !== '/'
    ) {
      return;
    }
    event.preventDefault();
    if (window.location.hash !== route.hash) {
      window.history.pushState(window.history.state, '', route.hash);
    }
    document.getElementById(route.id)?.scrollIntoView();
  };

  return (
    <Link
      aria-current={active ? (route.kind === 'section' ? 'location' : 'page') : undefined}
      className={className}
      data-active={active || undefined}
      href={href}
      {...props}
      onClick={sectionClick}
    >
      {t(`${route.id}.label`)}
    </Link>
  );
}
