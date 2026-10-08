import type { Metadata } from 'next';

import { PlaceholderPage } from '../../../components/placeholder-page';
import { routes } from '../../../config/routes';

export const metadata: Metadata = {
  title: routes.experience.title,
  description: routes.experience.description,
};

export default function ExperiencePage() {
  return <PlaceholderPage route={routes.experience} />;
}
