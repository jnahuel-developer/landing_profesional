import type { Metadata } from 'next';

import { PlaceholderPage } from '../../../components/placeholder-page';
import { routes } from '../../../config/routes';

export const metadata: Metadata = {
  title: routes.solutions.title,
  description: routes.solutions.description,
};

export default function SolutionsPage() {
  return <PlaceholderPage route={routes.solutions} />;
}
