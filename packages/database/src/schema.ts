import { pgSchema, uuid, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const platformSchema = pgSchema('platform');
export const demoCoreSchema = pgSchema('demo_core');
export const acmeCafeSchema = pgSchema('acme_cafe');
export const acmeLogisticaSchema = pgSchema('acme_logistica');

export const contactStatus = platformSchema.enum('contact_status', [
  'NEW',
  'READ',
  'RESPONDED',
  'ARCHIVED',
  'SPAM',
]);
export const notificationStatus = platformSchema.enum('notification_status', [
  'PENDING',
  'SENT',
  'FAILED',
]);
export const contactEventType = platformSchema.enum('contact_event_type', [
  'RECEIVED',
  'NOTIFICATION_SENT',
  'NOTIFICATION_FAILED',
]);
export const contactLocale = platformSchema.enum('contact_locale', ['es', 'en']);
export const contactCategory = platformSchema.enum('contact_category', [
  'web',
  'product',
  'automation',
  'data',
  'other',
]);
export const contacts = platformSchema.table('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 254 }).notNull(),
  company: varchar('company', { length: 160 }),
  projectType: contactCategory('project_type'),
  message: text('message').notNull(),
  locale: contactLocale('locale').notNull(),
  status: contactStatus('status').notNull().default('NEW'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  lastInteractionAt: timestamp('last_interaction_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  consentAt: timestamp('consent_at', { withTimezone: true }).notNull().defaultNow(),
  privacyNoticeVersion: varchar('privacy_notice_version', { length: 40 }).notNull(),
  notificationStatus: notificationStatus('notification_status').notNull().default('PENDING'),
});
export const contactEvents = platformSchema.table('contact_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  contactId: uuid('contact_id')
    .notNull()
    .references(() => contacts.id),
  type: contactEventType('type').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const applicationSchemaNames = [
  'platform',
  'demo_core',
  'acme_cafe',
  'acme_logistica',
] as const;
