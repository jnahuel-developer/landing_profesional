import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AdminLayout } from '../../components/layouts/admin-layout';
import { routes } from '../../config/routes';

export const metadata: Metadata = {
  title: routes.admin.title,
  description: routes.admin.description,
  robots: { follow: false, index: false },
};

export default function AdminRouteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminLayout>{children}</AdminLayout>;
}
