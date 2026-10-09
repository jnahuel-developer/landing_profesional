'use client';

import { useRef, useState, useSyncExternalStore, type FormEvent } from 'react';
import { Input, Textarea } from '@portfolio/ui';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Contact');
  const form = useRef<HTMLFormElement>(null);
  const ready = useSyncExternalStore(subscribe, client, server);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [prepared, setPrepared] = useState(false);
  const errorText = (field: ContactField) => {
    const code = errors[field];
    return code ? t(`errors.${code}`) : undefined;
  };

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = validateContact(new FormData(event.currentTarget));
    setErrors(next);
    setPrepared(false);
    const first = contactFields.find((field) => next[field]);
    if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    else setPrepared(true);
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
      <p id="contact-preparation">{t('preparation')}</p>
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
        disabled={!ready}
        aria-describedby="contact-preparation"
        data-track-event="contact_validation"
      >
        {t('submit')}
      </button>
      {!ready && <p>{t('withoutJs')}</p>}
      {prepared && (
        <p role="status" className="contact-prepared">
          {t('prepared')}
        </p>
      )}
    </form>
  );
}
