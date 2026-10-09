import { PlaceholderPage } from '../../../../components/placeholder-page';
import { getRouteMetadata } from '../../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('privacy');
export default function PrivacyPage() {
  return <PlaceholderPage routeId="privacy" />;
}
