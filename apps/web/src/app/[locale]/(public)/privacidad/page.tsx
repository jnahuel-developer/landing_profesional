import { PrivacyDocument } from '../../../../components/public-documents';
import { getRouteMetadata } from '../../../../lib/localized-page';
export const generateMetadata = () => getRouteMetadata('privacy');
export default function PrivacyPage() {
  return <PrivacyDocument />;
}
