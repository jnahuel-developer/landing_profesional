import { redirectLegacySection } from '../../../../lib/legacy-routes';

export default async function SolutionsPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}>) {
  const [{ locale }, search] = await Promise.all([params, searchParams]);
  redirectLegacySection(locale, 'solutions', search);
}
