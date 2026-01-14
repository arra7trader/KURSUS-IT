import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("🔍 Testing DB Connection...");
        console.log("DB URL:", process.env.TURSO_DATABASE_URL);
        console.log("Token Present:", !!process.env.TURSO_AUTH_TOKEN);

        const start = Date.now();
        // Query to check connection
        const result = await db.select().from(users).limit(1);
        const duration = Date.now() - start;

        return NextResponse.json({
            status: "success",
            message: "Database connected successfully",
            duration: `${duration}ms`,
            userCount: result.length,
            env: {
                url_prefix: process.env.TURSO_DATABASE_URL?.split(':')[0],
                token_length: process.env.TURSO_AUTH_TOKEN?.length
            }
        });
    } catch (error: any) {
        console.error("❌ DB Connection Failed:", error);
        return NextResponse.json({
            status: "error",
            message: error.message,
            stack: error.stack,
            cause: error.cause
        }, { status: 500 });
    }
}
