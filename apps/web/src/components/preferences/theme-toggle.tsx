'use client';

import { useTranslations } from 'next-intl';

import { usePreferences } from '../../preferences/preferences-provider';

function SunIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
    </svg>
  );
}

export function ThemeToggle() {
  const t = useTranslations('Preferences');
  const { resolvedTheme, setTheme } = usePreferences();
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';

  return (
    <button
      aria-label={t('toggleTheme')}
      aria-pressed={resolvedTheme === 'dark'}
      className="theme-toggle"
      data-theme-control
      onClick={() => setTheme(nextTheme)}
      type="button"
    >
      <span className="theme-icon theme-icon--sun">
        <SunIcon />
      </span>
      <span className="theme-icon theme-icon--moon">
        <MoonIcon />
      </span>
    </button>
  );
}
