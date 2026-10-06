import { pgSchema } from 'drizzle-orm/pg-core';

export const platformSchema = pgSchema('platform');
export const demoCoreSchema = pgSchema('demo_core');
export const acmeCafeSchema = pgSchema('acme_cafe');
export const acmeLogisticaSchema = pgSchema('acme_logistica');

export const applicationSchemaNames = [
  'platform',
  'demo_core',
  'acme_cafe',
  'acme_logistica',
] as const;
