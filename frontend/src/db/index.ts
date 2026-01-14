import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Validate environment variables
if (!process.env.TURSO_DATABASE_URL) {
    throw new Error('❌ TURSO_DATABASE_URL is not defined in environment variables');
}
if (!process.env.TURSO_AUTH_TOKEN) {
    throw new Error('❌ TURSO_AUTH_TOKEN is not defined in environment variables');
}

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
