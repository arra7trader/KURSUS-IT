import { createClient } from "@libsql/client";

const url = "https://kursus-it-arra7trader.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MjA2NjYsImlkIjoiMjc1MjA5YzAtNTkzYi00MmU3LWJmOWMtMTNmZDc0MDgzNjEwIiwicmlkIjoiMzlkMDc4ZDMtZjE0My00OGQ1LThkMDEtNzg4Mzc3ODg3MTkxIn0.a7dhZB1wl0GLvDPQ2PnqZvRrsBaMHVIU8Uq2CZ43Qz1KoOp_0OwG5rzehEEgOaqaowxlBwsSQJAc4ROGPL3dBA";

async function main() {
    console.log("Checking schema for table 'users'...");

    try {
        const client = createClient({
            url,
            authToken,
        });

        const rs = await client.execute("PRAGMA table_info(users)");
        console.log("Columns:", rs.rows);
    } catch (e) {
        console.error("❌ Failed:", e);
    }
}

main();
