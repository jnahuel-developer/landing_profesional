import { randomUUID } from 'node:crypto';

import { Client } from 'pg';

const TEST_DATABASE_PREFIX = 'portfolio_test_';
const SAFE_TEST_DATABASE_NAME = /^portfolio_test_[a-z0-9]{1,48}$/;

export interface TemporaryDatabase {
  name: string;
  url: string;
}

function assertSafeTestDatabaseName(name: string): void {
  if (!SAFE_TEST_DATABASE_NAME.test(name)) {
    throw new Error(`La base temporal debe usar el prefijo ${TEST_DATABASE_PREFIX}.`);
  }
}

function databaseUrlFor(sourceDatabaseUrl: string, name: string): string {
  const url = new URL(sourceDatabaseUrl);
  url.pathname = `/${name}`;
  return url.toString();
}

function quoteIdentifier(identifier: string): string {
  assertSafeTestDatabaseName(identifier);
  return `"${identifier}"`;
}

export function generateTestDatabaseName(identifier?: string): string {
  const name = identifier ?? `${TEST_DATABASE_PREFIX}${randomUUID().replaceAll('-', '')}`;
  assertSafeTestDatabaseName(name);
  return name;
}

export async function createTemporaryDatabase(
  sourceDatabaseUrl: string,
  identifier?: string,
): Promise<TemporaryDatabase> {
  const name = generateTestDatabaseName(identifier);
  const admin = new Client({ connectionString: databaseUrlFor(sourceDatabaseUrl, 'postgres') });

  try {
    await admin.connect();
    await admin.query(`create database ${quoteIdentifier(name)}`);
  } finally {
    await admin.end();
  }

  return { name, url: databaseUrlFor(sourceDatabaseUrl, name) };
}

export async function dropTemporaryDatabase(
  sourceDatabaseUrl: string,
  name: string,
): Promise<void> {
  assertSafeTestDatabaseName(name);
  const admin = new Client({ connectionString: databaseUrlFor(sourceDatabaseUrl, 'postgres') });

  try {
    await admin.connect();
    await admin.query(
      'select pg_terminate_backend(pid) from pg_stat_activity where datname = $1 and pid <> pg_backend_pid()',
      [name],
    );
    await admin.query(`drop database if exists ${quoteIdentifier(name)}`);
  } finally {
    await admin.end();
  }
}
