import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Portfolio de Nahuel Martínez',
  description: 'Página técnica temporal del portfolio profesional.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
