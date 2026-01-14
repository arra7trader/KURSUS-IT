import { createClient } from "@libsql/client";

const url = "https://kursus-it-arra7trader.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MjA2NjYsImlkIjoiMjc1MjA5YzAtNTkzYi00MmU3LWJmOWMtMTNmZDc0MDgzNjEwIiwicmlkIjoiMzlkMDc4ZDMtZjE0My00OGQ1LThkMDEtNzg4Mzc3ODg3MTkxIn0.a7dhZB1wl0GLvDPQ2PnqZvRrsBaMHVIU8Uq2CZ43Qz1KoOp_0OwG5rzehEEgOaqaowxlBwsSQJAc4ROGPL3dBA";

async function main() {
    console.log("Fixing 'users' table schema...");

    try {
        const client = createClient({
            url,
            authToken,
        });

        console.log("Adding column 'emailVerified'...");
        await client.execute("ALTER TABLE users ADD COLUMN emailVerified INTEGER");
        console.log("✅ Added emailVerified");

        console.log("Adding column 'image'...");
        await client.execute("ALTER TABLE users ADD COLUMN image TEXT");
        console.log("✅ Added image");

    } catch (e) {
        console.error("❌ Failed (might already exist):", e);
    }
}

main();
