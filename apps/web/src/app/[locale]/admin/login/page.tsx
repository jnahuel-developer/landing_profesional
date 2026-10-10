import { getTranslations } from 'next-intl/server';
import { AdminForm } from '../../../../admin/form';

export default async function AdminLoginPage() {
  const t = await getTranslations('Admin');
  return (
    <>
      <h1>{t('loginTitle')}</h1>
      <AdminForm />
    </>
  );
}
