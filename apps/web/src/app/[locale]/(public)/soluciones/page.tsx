import { PlaceholderPage } from '../../../../components/placeholder-page';
import { getRouteMetadata } from '../../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('solutions');
export default function SolutionsPage() {
  return <PlaceholderPage routeId="solutions" />;
}
