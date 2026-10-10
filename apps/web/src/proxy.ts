import createMiddleware from 'next-intl/middleware';
import type { NextRequest } from 'next/server';

import { routing } from './i18n/routing';

const localize = createMiddleware(routing);
export default function proxy(request: NextRequest) {
  const response = localize(request);
  if (/^\/(?:en\/|es\/)?admin(?:\/|$)/.test(request.nextUrl.pathname)) {
    response.headers.set('Cache-Control', 'no-store, private');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }
  return response;
}

export const config = {
  matcher: ['/((?!api|dev/ui(?:/|$)|_next|_vercel|.*\\..*).*)'],
};
