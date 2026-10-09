import { PlaceholderPage } from '../../../../components/placeholder-page';
import { getRouteMetadata } from '../../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('experience');
export default function ExperiencePage() {
  return <PlaceholderPage routeId="experience" />;
}
