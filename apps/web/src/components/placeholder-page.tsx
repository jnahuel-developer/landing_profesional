import type { AppRoute } from '../config/routes';

export function PlaceholderPage({ route }: Readonly<{ route: AppRoute }>) {
  return (
    <section aria-labelledby="page-title" className="placeholder-page">
      <p className="placeholder-page__eyebrow">Contenido provisional</p>
      <h1 id="page-title">{route.title}</h1>
      <p>{route.description}</p>
    </section>
  );
}
