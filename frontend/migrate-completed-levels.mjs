import { createClient } from '@libsql/client';
import * as dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function addCompletedLevelsColumn() {
    try {
        console.log('Adding completed_levels column...');

        await client.execute(`
            ALTER TABLE users ADD COLUMN completed_levels TEXT;
        `);

        console.log('✅ Column added successfully!');
        console.log('Initializing existing users with empty array...');

        await client.execute(`
            UPDATE users SET completed_levels = '[]' WHERE completed_levels IS NULL;
        `);

        console.log('✅ Migration complete!');
    } catch (error) {
        if (error.message.includes('duplicate column name')) {
            console.log('⚠️ Column already exists, skipping...');
        } else {
            console.error('❌ Migration error:', error);
        }
    } finally {
        client.close();
    }
}

addCompletedLevelsColumn();
