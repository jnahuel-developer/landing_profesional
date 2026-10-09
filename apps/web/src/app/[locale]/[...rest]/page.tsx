import { notFound } from 'next/navigation';

import { findLocalizedLegacySection, redirectLegacySection } from '../../../lib/legacy-routes';

export default async function UnknownLocalizedRoute({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string; rest: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ locale, rest }, search] = await Promise.all([params, searchParams]);
  const section = findLocalizedLegacySection(locale, rest);
  if (section) redirectLegacySection(locale, section, search);
  notFound();
}
