'use client';

import { densities } from '@portfolio/ui';
import { useTranslations } from 'next-intl';

import {
  motionPreferences,
  themePreferences,
  type MotionPreference,
  type ThemePreference,
} from '../../preferences/model';
import { usePreferences } from '../../preferences/preferences-provider';

export function PreferencesControls() {
  const t = useTranslations('Preferences');
  const { preferences, updatePreferences } = usePreferences();

  return (
    <div className="preferences-controls" role="group" aria-label={t('appearance')}>
      <label>
        <span>{t('theme')}</span>
        <select
          value={preferences.theme}
          onChange={(event) =>
            updatePreferences({ theme: event.currentTarget.value as ThemePreference })
          }
        >
          {themePreferences.map((theme) => (
            <option key={theme} value={theme}>
              {t(`themes.${theme}`)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{t('density')}</span>
        <select
          value={preferences.density}
          onChange={(event) =>
            updatePreferences({ density: event.currentTarget.value as (typeof densities)[number] })
          }
        >
          {densities.map((density) => (
            <option key={density} value={density}>
              {t(`densities.${density}`)}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>{t('motion')}</span>
        <select
          value={preferences.motion}
          onChange={(event) =>
            updatePreferences({ motion: event.currentTarget.value as MotionPreference })
          }
        >
          {motionPreferences.map((motion) => (
            <option key={motion} value={motion}>
              {t(`motions.${motion}`)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
