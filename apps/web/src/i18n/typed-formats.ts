import { platformTimeZone } from './formats';

export const formats = {
  dateTime: { platform: { dateStyle: 'medium', timeStyle: 'short', timeZone: platformTimeZone } },
  number: { decimal: { maximumFractionDigits: 2 } },
} as const;
