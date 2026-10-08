import Link from 'next/link';

import { PublicLayout } from '../components/layouts/public-layout';
import { routes } from '../config/routes';

export default function NotFoundPage() {
  return (
    <PublicLayout>
      <section aria-labelledby="not-found-title" className="placeholder-page">
        <p className="placeholder-page__eyebrow">Error 404</p>
        <h1 id="not-found-title">Página no encontrada</h1>
        <p>La dirección solicitada no está disponible.</p>
        <Link className="inline-action" href={routes.home.path}>
          Volver al inicio
        </Link>
      </section>
    </PublicLayout>
  );
}
