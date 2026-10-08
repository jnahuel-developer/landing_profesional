'use client';

import Link from 'next/link';

import { PublicLayout } from '../components/layouts/public-layout';
import { routes } from '../config/routes';

export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <PublicLayout>
      <section aria-labelledby="error-title" className="placeholder-page">
        <p className="placeholder-page__eyebrow">Error técnico</p>
        <h1 id="error-title">No pudimos completar la operación</h1>
        <p>Intentá nuevamente. Si el problema continúa, podés volver al inicio.</p>
        <div className="error-actions">
          <button className="inline-action" onClick={reset} type="button">
            Intentar nuevamente
          </button>
          <Link className="inline-action inline-action--secondary" href={routes.home.path}>
            Volver al inicio
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
