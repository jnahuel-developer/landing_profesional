import { PlaceholderPage } from '../../../../components/placeholder-page';
import { getRouteMetadata } from '../../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('about');
export default function AboutPage() {
  return <PlaceholderPage routeId="about" />;
}
