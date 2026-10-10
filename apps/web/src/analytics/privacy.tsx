'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { Dialog } from '@portfolio/ui';
import { normalizePublicPage } from '@portfolio/contracts';
import { Link } from '../i18n/navigation';
import { analytics } from './client';
import { consent, synchronizeConsent } from './consent';
import { observePublicBehavior } from './instrumentation';

const serverSnapshot = { state: 'undecided' as const, pending: false, failed: false };
function useConsent() {
  return useSyncExternalStore(consent.subscribe, consent.getSnapshot, () => serverSnapshot);
}
export function PrivacyPreferences({ compact = false }: { compact?: boolean }) {
  const t = useTranslations('Consent');
  const state = useConsent();
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    await consent.choose(checked);
    setBusy(false);
    if (!consent.getSnapshot().failed) setOpen(false);
  }
  return (
    <Dialog
      title={t('title')}
      description={t('description')}
      closeLabel={t('close')}
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setChecked(state.state === 'accepted');
      }}
      trigger={
        <button type="button" className="inline-action inline-action--secondary">
          {t(compact ? 'configure' : 'preferences')}
        </button>
      }
    >
      <p>{t('necessaryDescription')}</p>
      <label>
        <input type="checkbox" checked disabled /> {t('necessary')}
      </label>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />{' '}
        {t('analytics')}
      </label>
      <p>{t('analyticsDescription')}</p>
      <button
        type="button"
        className="inline-action"
        onClick={() => {
          void save();
        }}
        disabled={busy}
      >
        {t('save')}
      </button>
      {state.failed && <p role="status">{t('failure')}</p>}
    </Dialog>
  );
}
export function PrivacyRuntime() {
  const t = useTranslations('Consent');
  const pathname = usePathname();
  const locale = useLocale();
  const state = useConsent();
  const publicPage = normalizePublicPage(pathname);
  const publicEnabled = publicPage !== null;
  useEffect(() => {
    if (publicEnabled) return synchronizeConsent();
  }, [publicEnabled]);
  useEffect(() => {
    if (!publicPage || state.state !== 'accepted' || !analytics.active) return;
    analytics.activate(`${publicPage}:${locale}`);
    return observePublicBehavior();
  }, [publicPage, locale, state]);
  if (!publicPage) return null;
  return (
    <>
      {state.state === 'undecided' && (
        <aside className="privacy-notice" aria-label={t('title')}>
          <p>{t('description')}</p>
          <div className="privacy-notice__actions">
            <button
              className="inline-action inline-action--secondary"
              type="button"
              onClick={() => {
                void consent.choose(true);
              }}
            >
              {t('accept')}
            </button>
            <button
              className="inline-action inline-action--secondary"
              type="button"
              onClick={() => {
                void consent.choose(false);
              }}
            >
              {t('reject')}
            </button>
            <PrivacyPreferences compact />
            <Link href="/privacidad">{t('privacy')}</Link>
          </div>
        </aside>
      )}
      {state.failed && (
        <p className="privacy-sync-status" role="status">
          {t('failure')}
        </p>
      )}
    </>
  );
}
