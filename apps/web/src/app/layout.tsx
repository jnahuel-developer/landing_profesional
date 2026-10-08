import type { Metadata } from 'next';
import localFont from 'next/font/local';
import type { ReactNode } from 'react';

import '../styles/globals.css';

const geist = localFont({
  src: '../../public/fonts/geist-variable.woff2',
  display: 'swap',
  variable: '--font-geist',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Portfolio de Nahuel Martínez',
  description: 'Página técnica temporal del portfolio profesional.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={geist.variable} data-density="comfortable" data-theme="light" lang="es">
      <body>{children}</body>
    </html>
  );
}
