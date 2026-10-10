import { and, eq, gt, lte, lt, sql } from 'drizzle-orm';
import type { DatabaseClient } from './client.js';
import { adminUsers, adminSessions, adminAudit } from './schema.js';

export type AdminUser = typeof adminUsers.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
export type AdminAuditCode = typeof adminAudit.$inferInsert.code;
export interface AdminRepository {
  user(): Promise<AdminUser | undefined>;
  create(identifier: string, passwordHash: string): Promise<void>;
  invalidate(passwordHash?: string): Promise<void>;
  rotate(user: AdminUser, session: AdminSession, previous?: string): Promise<boolean>;
  session(digest: string, now: Date): Promise<(AdminSession & { identifier: string }) | undefined>;
  logout(digest?: string): Promise<void>;
  audit(code: AdminAuditCode): Promise<void>;
  retain(now: Date): Promise<void>;
}
export function createAdminRepository(db: DatabaseClient): AdminRepository {
  return {
    user: async () => (await db.select().from(adminUsers))[0],
    create: async (identifier, passwordHash) => {
      await db.transaction(async (tx) => {
        await tx.insert(adminUsers).values({ identifier, passwordHash });
        await tx.insert(adminAudit).values({ code: 'ACCOUNT_CREATED' });
      });
    },
    invalidate: async (passwordHash) => {
      await db.transaction(async (tx) => {
        // Same row lock as login: a concurrent login cannot resurrect revoked credentials.
        const [user] = await tx.select().from(adminUsers).for('update');
        if (!user) throw new Error('ADMIN_ACCOUNT_ABSENT');
        await tx
          .update(adminUsers)
          .set({
            ...(passwordHash === undefined ? {} : { passwordHash }),
            credentialVersion: sql`${adminUsers.credentialVersion} + 1`,
            updatedAt: new Date(),
          })
          .where(eq(adminUsers.id, user.id));
        await tx.delete(adminSessions);
        await tx
          .insert(adminAudit)
          .values({ code: passwordHash === undefined ? 'SESSIONS_REVOKED' : 'PASSWORD_CHANGED' });
      });
    },
    rotate: async (user, session, previous) =>
      db.transaction(async (tx) => {
        const [current] = await tx
          .select()
          .from(adminUsers)
          .where(eq(adminUsers.id, user.id))
          .for('update');
        if (!current || current.credentialVersion !== user.credentialVersion) return false;
        if (previous) await tx.delete(adminSessions).where(eq(adminSessions.digest, previous));
        await tx.insert(adminSessions).values(session);
        await tx.insert(adminAudit).values({ code: 'LOGIN_OK' });
        return true;
      }),
    session: async (digest, now) => {
      const [row] = await db
        .select({ session: adminSessions, identifier: adminUsers.identifier })
        .from(adminSessions)
        .innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id))
        .where(and(eq(adminSessions.digest, digest), gt(adminSessions.expiresAt, now)));
      return row ? { ...row.session, identifier: row.identifier } : undefined;
    },
    logout: async (digest) => {
      await db.transaction(async (tx) => {
        if (digest) {
          const removed = await tx
            .delete(adminSessions)
            .where(eq(adminSessions.digest, digest))
            .returning();
          if (removed.length) await tx.insert(adminAudit).values({ code: 'LOGOUT' });
        } else await tx.execute(sql`select 1`);
      });
    },
    audit: async (code) => {
      await db.insert(adminAudit).values({ code });
    },
    retain: async (now) => {
      await db.transaction(async (tx) => {
        await tx.delete(adminSessions).where(lte(adminSessions.expiresAt, now));
        await tx
          .delete(adminAudit)
          .where(lt(adminAudit.createdAt, new Date(now.getTime() - 180 * 86400_000)));
      });
    },
  };
}
