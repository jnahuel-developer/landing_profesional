import { ContinuousHome } from '../../../components/home/continuous-home';
import { getRouteMetadata } from '../../../lib/localized-page';

export const generateMetadata = () => getRouteMetadata('home');
export default function HomePage() {
  return <ContinuousHome />;
}
