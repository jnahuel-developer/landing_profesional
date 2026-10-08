import type { Metadata } from 'next';

import { PlaceholderPage } from '../../../components/placeholder-page';
import { routes } from '../../../config/routes';

export const metadata: Metadata = {
  title: routes.contact.title,
  description: routes.contact.description,
};

export default function ContactPage() {
  return <PlaceholderPage route={routes.contact} />;
}
