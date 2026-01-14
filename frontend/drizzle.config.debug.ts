import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'sqlite',
    dbCredentials: {
        url: "https://kursus-it-arra7trader.aws-ap-northeast-1.turso.io",
        authToken: "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njg0MjA2NjYsImlkIjoiMjc1MjA5YzAtNTkzYi00MmU3LWJmOWMtMTNmZDc0MDgzNjEwIiwicmlkIjoiMzlkMDc4ZDMtZjE0My00OGQ1LThkMDEtNzg4Mzc3ODg3MTkxIn0.a7dhZB1wl0GLvDPQ2PnqZvRrsBaMHVIU8Uq2CZ43Qz1KoOp_0OwG5rzehEEgOaqaowxlBwsSQJAc4ROGPL3dBA",
    },
});
