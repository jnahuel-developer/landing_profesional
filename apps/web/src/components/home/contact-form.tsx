'use client';

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { Input, Textarea } from '@portfolio/ui';
import { useLocale, useTranslations } from 'next-intl';
import { normalizeContact, type ContactInput } from '@portfolio/contracts';
import { ContactQueryProvider, useContactMutation } from './contact-mutation';
import { Link } from '../../i18n/navigation';
import {
  contactFields,
  contactLimits,
  projectTypes,
  validateContact,
  type ContactErrors,
  type ContactField,
} from './contact-validation';

const subscribe = () => () => {};
const client = () => true;
const server = () => false;

export function ContactForm() {
  return (
    <ContactQueryProvider>
      <ContactFormContent />
    </ContactQueryProvider>
  );
}

function ContactFormContent() {
  const t = useTranslations('Contact');
  const locale = useLocale();
  const mutation = useContactMutation();
  const submitting = useRef(false);
  const startedAt = useRef<number | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const ready = useSyncExternalStore(subscribe, client, server);
  useEffect(() => {
    if (ready && startedAt.current === null) startedAt.current = Date.now();
  }, [ready]);
  const [errors, setErrors] = useState<ContactErrors>({});
  const errorText = (field: ContactField) => {
    const code = errors[field];
    return code ? t(`errors.${code}`) : undefined;
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    const data = new FormData(event.currentTarget);
    const next = validateContact(data);
    setErrors(next);
    mutation.reset();
    const first = contactFields.find((field) => next[field]);
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    else {
      submitting.current = true;
      try {
        await mutation.mutateAsync(
          normalizeContact({
            name: data.get('name'),
            email: data.get('email'),
            company: data.get('company'),
            projectType: data.get('projectType'),
            message: data.get('message'),
            privacyAccepted: true,
            locale,
            website: data.get('website') ?? '',
            formStartedAt: startedAt.current ?? Date.now(),
          }) as ContactInput,
        );
        form.current?.reset();
        startedAt.current = Date.now();
      } catch {
        /* La mutation conserva el error para su anuncio accesible. */
      } finally {
        submitting.current = false;
      }
    }
  }

  return (
    <form
      ref={form}
      className="contact-form"
      noValidate
      onSubmit={submit}
      aria-labelledby="contact-form-title"
      data-track-event="contact_started"
    >
      <h3 id="contact-form-title">{t('title')}</h3>
      <div hidden aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {Object.keys(errors).length > 0 && (
        <div role="alert" className="contact-errors">
          <p>{t('errorSummary')}</p>
          <ul>
            {contactFields
              .filter((field) => errors[field])
              .map((field) => (
                <li key={field}>
                  <a href={`#contact-${field}`}>
                    {t(`fields.${field}`)}: {errorText(field)}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      )}
      <Input
        id="contact-name"
        name="name"
        label={t('fields.name')}
        required
        maxLength={contactLimits.name}
        autoComplete="name"
        error={errorText('name')}
      />
      <Input
        id="contact-email"
        name="email"
        label={t('fields.email')}
        required
        type="email"
        maxLength={contactLimits.email}
        autoComplete="email"
        error={errorText('email')}
      />
      <Input
        id="contact-company"
        name="company"
        label={t('fields.company')}
        maxLength={contactLimits.company}
        autoComplete="organization"
        error={errorText('company')}
      />
      <div className="ui-field">
        <label className="ui-field__label" htmlFor="contact-projectType">
          {t('fields.projectType')}
        </label>
        <select
          className="ui-input"
          id="contact-projectType"
          name="projectType"
          aria-invalid={Boolean(errors.projectType)}
          aria-describedby={errors.projectType ? 'contact-projectType-error' : undefined}
        >
          <option value="">{t('choose')}</option>
          {projectTypes.map((value) => (
            <option value={value} key={value}>
              {t(`projects.${value}`)}
            </option>
          ))}
        </select>
        {errors.projectType && (
          <span className="ui-field__error" id="contact-projectType-error">
            {errorText('projectType')}
          </span>
        )}
      </div>
      <Textarea
        id="contact-message"
        name="message"
        label={t('fields.message')}
        required
        maxLength={contactLimits.message}
        rows={6}
        description={t('messageHint', { limit: contactLimits.message })}
        error={errorText('message')}
      />
      <div className="ui-field">
        <label className="contact-privacy" htmlFor="contact-privacyAccepted">
          <input
            type="checkbox"
            id="contact-privacyAccepted"
            name="privacyAccepted"
            required
            aria-invalid={Boolean(errors.privacyAccepted)}
            aria-describedby={errors.privacyAccepted ? 'contact-privacyAccepted-error' : undefined}
          />
          {t('fields.privacyAccepted')}
        </label>
        <Link href="/privacidad">{t('readPrivacy')}</Link>
        {errors.privacyAccepted && (
          <span className="ui-field__error" id="contact-privacyAccepted-error">
            {errorText('privacyAccepted')}
          </span>
        )}
      </div>
      <button
        className="inline-action"
        type="submit"
        disabled={!ready || mutation.isPending}
        data-track-event="contact_validation"
      >
        {mutation.isPending ? t('pending') : t('submit')}
      </button>
      {!ready && <p>{t('withoutJs')}</p>}
      {mutation.isSuccess && (
        <p role="status" className="contact-prepared">
          {t('success')}
        </p>
      )}
      {mutation.isPending && <p role="status">{t('pending')}</p>}
      {mutation.isError && (
        <p role="alert">{t(`deliveryErrors.${deliveryError(mutation.error.message)}`)}</p>
      )}
    </form>
  );
}

function deliveryError(code: string) {
  switch (code) {
    case 'CONTACT_TOO_FAST':
      return 'tooFast';
    case 'VALIDATION_ERROR':
      return 'validation';
    case 'PAYLOAD_TOO_LARGE':
      return 'payload';
    case 'RATE_LIMITED':
      return 'rateLimit';
    default:
      return 'unavailable';
  }
}
