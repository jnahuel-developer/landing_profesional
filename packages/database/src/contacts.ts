import { eq } from 'drizzle-orm';
import type { DatabaseClient } from './client.js';
import { contacts, contactEvents } from './schema.js';

export type NewContact = Pick<
  typeof contacts.$inferInsert,
  'name' | 'email' | 'company' | 'projectType' | 'message' | 'locale'
>;
export interface ContactRepository {
  receive(input: NewContact): Promise<string>;
  recordNotification(id: string, status: 'SENT' | 'FAILED'): Promise<void>;
}

export function createContactRepository(db: DatabaseClient): ContactRepository {
  return {
    receive: async (input) =>
      db.transaction(async (tx) => {
        const [contact] = await tx
          .insert(contacts)
          .values({ ...input, privacyNoticeVersion: '2026-10-05' })
          .returning({ id: contacts.id });
        if (!contact) throw new Error('CONTACT_INSERT_FAILED');
        await tx.insert(contactEvents).values({ contactId: contact.id, type: 'RECEIVED' });
        return contact.id;
      }),
    recordNotification: async (id, status) => {
      await db.transaction(async (tx) => {
        await tx
          .update(contacts)
          .set({ notificationStatus: status, updatedAt: new Date() })
          .where(eq(contacts.id, id));
        await tx.insert(contactEvents).values({
          contactId: id,
          type: status === 'SENT' ? 'NOTIFICATION_SENT' : 'NOTIFICATION_FAILED',
        });
      });
    },
  };
}
