import { createClient } from "@libsql/client";

const url = "https://kursus-it-arra7trader.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MjA2NjYsImlkIjoiMjc1MjA5YzAtNTkzYi00MmU3LWJmOWMtMTNmZDc0MDgzNjEwIiwicmlkIjoiMzlkMDc4ZDMtZjE0My00OGQ1LThkMDEtNzg4Mzc3ODg3MTkxIn0.a7dhZB1wl0GLvDPQ2PnqZvRrsBaMHVIU8Uq2CZ43Qz1KoOp_0OwG5rzehEEgOaqaowxlBwsSQJAc4ROGPL3dBA";

async function main() {
    console.log("Testing connection...");
    console.log("URL:", url);
    console.log("Token length:", authToken.length);

    try {
        const client = createClient({
            url,
            authToken,
        });

        const rs = await client.execute("SELECT 1");
        console.log("✅ Success! Result:", rs);
    } catch (e) {
        console.error("❌ Connection failed:", e);
    }
}

main();
