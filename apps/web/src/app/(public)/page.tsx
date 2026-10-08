import type { Metadata } from 'next';

import { PlaceholderPage } from '../../components/placeholder-page';
import { routes } from '../../config/routes';

export const metadata: Metadata = {
  title: routes.home.title,
  description: routes.home.description,
};

export default function HomePage() {
  return <PlaceholderPage route={routes.home} />;
}
