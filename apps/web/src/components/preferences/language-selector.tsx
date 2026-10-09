'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import type { ChangeEvent } from 'react';

import { usePathname, useRouter } from '../../i18n/navigation';
import { locales, type Locale } from '../../i18n/routing';

export function LanguageSelector() {
  const locale = useLocale() as Locale;
  const navigation = useTranslations('Navigation');
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  function changeLocale(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.currentTarget.value as Locale;
    const query = searchParams.toString();
    const hash = window.location.hash;
    router.replace(`${pathname}${query ? `?${query}` : ''}${hash}`, { locale: nextLocale });
  }

  return (
    <label className="language-selector">
      <span className="visually-hidden">{navigation('language')}</span>
      <select onChange={changeLocale} value={locale}>
        {locales.map((option) => {
          return (
            <option key={option} value={option}>
              {option.toUpperCase()}
            </option>
          );
        })}
      </select>
    </label>
  );
}
