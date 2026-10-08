import { PlaceholderPage } from '../../../components/placeholder-page';
import { getRouteMetadata } from '../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('home');
export default function HomePage() {
  return <PlaceholderPage routeId="home" />;
}
