import type { Metadata } from 'next';

import { PlaceholderPage } from '../../../components/placeholder-page';
import { routes } from '../../../config/routes';

export const metadata: Metadata = {
  title: routes.process.title,
  description: routes.process.description,
};

export default function ProcessPage() {
  return <PlaceholderPage route={routes.process} />;
}
