import { PlaceholderPage } from '../../../../components/placeholder-page';
import { getRouteMetadata } from '../../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('contact');
export default function ContactPage() {
  return <PlaceholderPage routeId="contact" />;
}
