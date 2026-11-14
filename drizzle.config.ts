// Drizzle Config
//
// DB_TARGET=prod  -> loads .env (production), uses DATABASE_URL_MIGRATE, requires CONFIRM_PROD=yes
// anything else   -> loads .env.development.local (Docker / localhost only)

import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Production Supabase project ref (from the dashboard URL / pooler username)
const PROD_PROJECT_REF = 'oljreatgbmukewdlczfj';

const target = process.env.DB_TARGET === 'prod' ? 'prod' : 'local';

// Ignore anything inherited from the shell or Windows environment
delete process.env.DATABASE_URL;
delete process.env.DATABASE_URL_MIGRATE;

const result = config({
  path: target === 'prod' ? '.env' : '.env.development.local',
  override: true,
  quiet: true,
});
if (result.error) throw result.error; // file missing or unreadable

// Prod migrations use DATABASE_URL_MIGRATE (session pooler or direct, port 5432).
// The app keeps using DATABASE_URL (transaction pooler, port 6543).
const url =
  (target === 'prod' ? process.env.DATABASE_URL_MIGRATE : undefined) ?? process.env.DATABASE_URL;
if (!url) throw new Error(`DATABASE_URL missing from the ${target} env file`);

const parsed = new URL(url);
const host = parsed.hostname;
const isLocalHost = host === '127.0.0.1' || host === 'localhost';

if (target === 'local') {
  if (!isLocalHost) {
    throw new Error(`Refusing to run: target is local but host is ${host}`);
  }
}

if (target === 'prod') {
  if (isLocalHost) {
    throw new Error('Target is prod but the database URL points at localhost');
  }
  if (!process.env.DATABASE_URL_MIGRATE) {
    throw new Error('Add DATABASE_URL_MIGRATE (session pooler or direct, port 5432) to .env for prod migrations');
  }
  // Project ref appears in the host (direct connection) or the username (pooler)
  const matchesProd =
    host.includes(PROD_PROJECT_REF) || decodeURIComponent(parsed.username).includes(PROD_PROJECT_REF);
  if (!matchesProd) {
    throw new Error(`Target is prod but ${host} doesn't match the production project ref`);
  }
  if (process.env.CONFIRM_PROD !== 'yes') {
    throw new Error('Set CONFIRM_PROD=yes to run against production');
  }
  if (parsed.port === '6543') {
    throw new Error('Use the direct (5432) or session pooler URL for migrations, not the 6543 transaction pooler');
  }
}

console.log(`drizzle target: ${target.toUpperCase()} -> ${host}`);

export default defineConfig({
  schema: './db/schemaDB.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: { url },
});