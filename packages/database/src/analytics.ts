import { randomUUID } from 'node:crypto';
import { and, desc, eq, gt, inArray, isNull, ne, sql } from 'drizzle-orm';
import type { DatabaseClient } from './client.js';
import {
  analyticsConsents as consents,
  analyticsSessions as sessions,
  analyticsEvents as events,
  analyticsDaily as daily,
} from './schema.js';

export interface StoredAnalyticsEvent {
  id: string;
  name: string;
  at: number;
  dimensions: Record<string, string>;
  properties: Record<string, string | number>;
}
export interface AnalyticsRepository {
  accept(id: string, now: Date, expires: Date): Promise<void>;
  valid(id: string, now: Date): Promise<boolean>;
  revoke(id: string, now: Date): Promise<void>;
  ingest(
    receipt: string,
    visitor: string,
    session: string | undefined,
    batch: StoredAnalyticsEvent[],
    now: Date,
  ): Promise<string | null>;
}
export function createAnalyticsRepository(db: DatabaseClient): AnalyticsRepository {
  const validWhere = (id: string, now: Date) =>
    and(
      eq(consents.id, id),
      eq(consents.version, 1),
      gt(consents.expiresAt, now),
      isNull(consents.revokedAt),
    );
  return {
    accept: async (id, now, expires) => {
      await db.insert(consents).values({ id, version: 1, acceptedAt: now, expiresAt: expires });
    },
    valid: async (id, now) =>
      (await db.select({ id: consents.id }).from(consents).where(validWhere(id, now))).length === 1,
    revoke: async (id, now) => {
      await db.update(consents).set({ revokedAt: now }).where(eq(consents.id, id));
    },
    ingest: async (receipt, visitor, session, batch, now) =>
      db.transaction(async (tx) => {
        // The same row lock serializes ingestion and revocation across all API processes.
        const [consent] = await tx
          .select()
          .from(consents)
          .where(validWhere(receipt, now))
          .for('update');
        if (!consent) return null;
        // A long-lived consent receipt must not bridge visitor rotations.
        await tx
          .update(sessions)
          .set({ consentId: null })
          .where(and(eq(sessions.consentId, receipt), ne(sessions.visitorId, visitor)));
        const duplicates = await tx
          .select({ id: events.id, sessionId: events.sessionId, consentId: sessions.consentId })
          .from(events)
          .innerJoin(sessions, eq(events.sessionId, sessions.id))
          .where(
            inArray(
              events.id,
              batch.map((event) => event.id),
            ),
          );
        if (duplicates.some((event) => event.consentId !== receipt)) return null;
        const fresh = batch.filter(
          (event) => !duplicates.some((duplicate) => duplicate.id === event.id),
        );
        if (!fresh.length) return duplicates[0]!.sessionId;
        const [previous] = session
          ? await tx.select().from(sessions).where(eq(sessions.id, session))
          : await tx
              .select()
              .from(sessions)
              .where(
                and(
                  eq(sessions.consentId, receipt),
                  eq(sessions.visitorId, visitor),
                  gt(sessions.lastAt, new Date(now.getTime() - 30 * 60_000)),
                ),
              )
              .orderBy(desc(sessions.lastAt))
              .limit(1);
        const reuse =
          previous &&
          previous.consentId === receipt &&
          previous.visitorId === visitor &&
          now.getTime() - previous.lastAt.getTime() < 30 * 60_000;
        const id = reuse ? previous.id : randomUUID();
        if (!reuse)
          await tx.insert(sessions).values({
            id,
            consentId: receipt,
            visitorId: visitor,
            entry: batch[0]!.dimensions.page!,
            firstAt: now,
            lastAt: now,
          });
        const inserted = await tx
          .insert(events)
          .values(
            fresh.map((event) => ({
              id: event.id,
              sessionId: id,
              version: 1,
              name: event.name,
              receivedAt: now,
              occurredAt: new Date(event.at),
              dimensions: event.dimensions,
              properties: event.properties,
              onceKey:
                event.name === 'contact_started'
                  ? event.name
                  : event.name === 'section_viewed'
                    ? `${event.name}:${event.properties.section}`
                    : null,
            })),
          )
          .onConflictDoNothing()
          .returning({ name: events.name });
        const counters = { ...(reuse ? previous.counters : {}) };
        for (const event of inserted) counters[event.name] = (counters[event.name] ?? 0) + 1;
        await tx
          .update(sessions)
          .set({
            lastAt: now,
            durationSeconds: reuse
              ? Math.max(0, Math.floor((now.getTime() - previous.firstAt.getTime()) / 1000))
              : 0,
            counters,
          })
          .where(eq(sessions.id, id));
        return id;
      }),
  };
}

export function analyticsDay(value: string | undefined, now = new Date()): string {
  const day = value ?? new Date(now.getTime() - 86_400_000).toISOString().slice(0, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(day) ||
    !Number.isFinite(Date.parse(day)) ||
    new Date(day).toISOString().slice(0, 10) !== day ||
    day >= now.toISOString().slice(0, 10)
  )
    throw new Error('ANALYTICS_DAY_INVALID');
  return day;
}
export async function aggregateAnalytics(db: DatabaseClient, day: string, now = new Date()) {
  analyticsDay(day, now);
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext('analytics:' || ${day}))`);
    const start = new Date(`${day}T00:00:00Z`);
    const end = new Date(start.getTime() + 86_400_000);
    // Never replace an aggregate whose raw source is outside the retention window.
    if (start.getTime() < now.getTime() - 180 * 86_400_000) return false;
    const result =
      await tx.execute(sql`select name, dimensions, properties, count(*)::integer as events,
      count(distinct session_id)::integer as sessions from platform.analytics_events
      where received_at >= ${start} and received_at < ${end} group by name, dimensions, properties`);
    const entries =
      await tx.execute(sql`select entry, count(*)::integer as sessions from platform.analytics_sessions
      where first_at >= ${start} and first_at < ${end} group by entry`);
    await tx
      .insert(daily)
      .values({ day, metrics: { groups: result.rows, entries: entries.rows }, updatedAt: now })
      .onConflictDoUpdate({
        target: daily.day,
        set: { metrics: { groups: result.rows, entries: entries.rows }, updatedAt: now },
      });
    return true;
  });
}
export async function retainAnalytics(db: DatabaseClient, now = new Date()) {
  await db.transaction(async (tx) => {
    await tx.execute(
      sql`delete from platform.analytics_events where received_at < ${now}::timestamptz - interval '180 days'`,
    );
    await tx.execute(
      sql`delete from platform.analytics_sessions where last_at < ${now}::timestamptz - interval '24 months'`,
    );
    // Sessions do not need a permanent receipt reference after expiry/revocation.
    await tx.execute(sql`update platform.analytics_sessions set consent_id = null where consent_id in
      (select id from platform.analytics_consents where expires_at <= ${now} or revoked_at is not null)`);
    await tx.execute(
      sql`delete from platform.analytics_consents where expires_at <= ${now} or revoked_at is not null`,
    );
  });
}
