import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

// Load .env.local because Next.js stores secrets there
dotenv.config({ path: '.env.local' });

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
    },
});
