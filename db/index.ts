import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "./schemaDB"

config({ path: '.env' });

const connectionString = process.env.DATABASE_URL ||
"postgres://localhost:5432/drizzle";

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });