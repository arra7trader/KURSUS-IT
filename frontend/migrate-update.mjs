import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
    try {
        console.log("Running migration: ADD current_level to users...");
        await client.execute("ALTER TABLE users ADD COLUMN current_level text");
        console.log("Migration successful!");
    } catch (e) {
        console.error("Migration failed:", e);
    }
}

main();
