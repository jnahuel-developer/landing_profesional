import { PlaceholderPage } from '../../../../components/placeholder-page';
import { getRouteMetadata } from '../../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('process');
export default function ProcessPage() {
  return <PlaceholderPage routeId="process" />;
}
