import type { Metadata } from 'next';

import { PlaceholderPage } from '../../../components/placeholder-page';
import { routes } from '../../../config/routes';

export const metadata: Metadata = {
  title: routes.privacy.title,
  description: routes.privacy.description,
};

export default function PrivacyPage() {
  return <PlaceholderPage route={routes.privacy} />;
}
