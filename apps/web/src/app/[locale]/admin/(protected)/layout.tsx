import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { getAdminSession } from '../../../../admin/server';

export const dynamic = 'force-dynamic';
export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const result = await getAdminSession();
  const locale = await getLocale();
  const base = `${locale === 'en' ? '/en' : ''}/admin`;
  if (result.state === 'unauthorized') redirect(`${base}/login`);
  if (result.state === 'unavailable') {
    const t = await getTranslations('Admin');
    return (
      <>
        <h1>{t('unavailableTitle')}</h1>
        <p role="status">{t('unavailable')}</p>
        <a href={base}>{t('retry')}</a>
      </>
    );
  }
  return children;
}
