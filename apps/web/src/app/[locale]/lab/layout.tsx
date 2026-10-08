import type { ReactNode } from 'react';

import { LaboratoryLayout } from '../../../components/layouts/laboratory-layout';
import { getRouteMetadata } from '../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('laboratory');
export default function LaboratoryRouteLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <LaboratoryLayout>{children}</LaboratoryLayout>;
}
