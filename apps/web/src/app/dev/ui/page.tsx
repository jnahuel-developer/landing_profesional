import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { UiCatalog } from './ui-catalog';
import './catalog.css';

export const metadata: Metadata = {
  title: 'Catálogo interno de UI',
  robots: { follow: false, index: false },
};

export default function UiCatalogPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <UiCatalog />;
}
