import type { Metadata } from 'next';

import { PlaceholderPage } from '../../../components/placeholder-page';
import { routes } from '../../../config/routes';

export const metadata: Metadata = {
  title: routes.about.title,
  description: routes.about.description,
};

export default function AboutPage() {
  return <PlaceholderPage route={routes.about} />;
}
