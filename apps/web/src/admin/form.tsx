'use client';
import { useRef, useState, type FormEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export function AdminForm({ csrf }: { csrf?: string }) {
  const t = useTranslations('Admin');
  const locale = useLocale();
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef(false);
  const password = useRef<HTMLInputElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setFailed(false);
    const data = new FormData(event.currentTarget);
    try {
      const result = await fetch(`/api/v1/admin/auth/${csrf ? 'logout' : 'login'}`, {
        method: 'POST',
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json', ...(csrf ? { 'X-Admin-CSRF': csrf } : {}) },
        body: JSON.stringify(
          csrf ? {} : { identifier: data.get('identifier'), password: data.get('password') },
        ),
      });
      if (!result.ok) throw new Error('ADMIN_REQUEST_FAILED');
      // Reload after authentication so a previously cached private RSC tree cannot survive.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign(`${locale === 'en' ? '/en' : ''}/admin${csrf ? '/login' : ''}`);
    } catch {
      setFailed(true);
    } finally {
      if (password.current) password.current.value = '';
      setBusy(false);
      pending.current = false;
    }
  }
  return (
    <form
      className="admin-auth-form"
      onSubmit={(event) => {
        void submit(event);
      }}
      aria-busy={busy}
    >
      {!csrf && (
        <>
          <label htmlFor="admin-identifier">{t('identifier')}</label>
          <input
            id="admin-identifier"
            name="identifier"
            autoComplete="username"
            required
            maxLength={100}
            disabled={busy}
          />
          <label htmlFor="admin-password">{t('password')}</label>
          <input
            ref={password}
            id="admin-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            minLength={12}
            maxLength={256}
            disabled={busy}
          />
        </>
      )}
      <button className="inline-action" type="submit" disabled={busy}>
        {busy ? t('pending') : t(csrf ? 'logout' : 'login')}
      </button>
      <p role="status" aria-live="polite">
        {failed ? t('error') : busy ? t('pending') : ''}
      </p>
    </form>
  );
}
