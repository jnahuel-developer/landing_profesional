import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { LaboratoryLayout } from '../../components/layouts/laboratory-layout';
import { routes } from '../../config/routes';

export const metadata: Metadata = {
  title: routes.laboratory.title,
  description: routes.laboratory.description,
  robots: { follow: false, index: false },
};

export default function LaboratoryRouteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <LaboratoryLayout>{children}</LaboratoryLayout>;
}
