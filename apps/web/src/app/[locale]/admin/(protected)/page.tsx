import { getTranslations } from 'next-intl/server';
import { getAdminSession } from '../../../../admin/server';
import { AdminForm } from '../../../../admin/form';

export default async function AdminPage() {
  const result = await getAdminSession();
  const t = await getTranslations('Admin');
  if (result.state !== 'authorized') return null;
  return (
    <>
      <h1>{t('title')}</h1>
      <p>{t('authorized')}</p>
      <p>{result.session.identifier}</p>
      <AdminForm csrf={result.session.csrf} />
    </>
  );
}
