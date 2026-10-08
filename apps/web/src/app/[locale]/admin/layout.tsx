import type { ReactNode } from 'react';

import { AdminLayout } from '../../../components/layouts/admin-layout';
import { getRouteMetadata } from '../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('admin');
export default function AdminRouteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <AdminLayout>{children}</AdminLayout>;
}
