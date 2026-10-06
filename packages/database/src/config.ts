export interface DatabaseConfig {
  databaseUrl: string;
}

export function parseDatabaseUrl(value: string | undefined): string {
  if (!value) {
    throw new Error('DATABASE_URL es obligatoria.');
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error('DATABASE_URL debe ser una URL PostgreSQL válida.');
  }

  if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') {
    throw new Error('DATABASE_URL debe usar el protocolo PostgreSQL.');
  }

  return value;
}

export function loadDatabaseConfig(environment: NodeJS.ProcessEnv = process.env): DatabaseConfig {
  return {
    databaseUrl: parseDatabaseUrl(environment.DATABASE_URL),
  };
}
