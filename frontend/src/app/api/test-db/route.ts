import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("🔍 Testing DB Connection...");
        console.log("DB URL:", process.env.TURSO_DATABASE_URL);
        console.log("Token Present:", !!process.env.TURSO_AUTH_TOKEN);

        const start = Date.now();

        // 1. Query to check read
        const result = await db.select().from(users).limit(1);

        // 2. Try to Insert a test user
        const testId = `test-${Date.now()}`;
        await db.insert(users).values({
            id: testId,
            email: `test-${Date.now()}@example.com`,
            name: "Test DB User",
            currentPath: "ANALYST"
        });

        // 3. Clean up (delete)
        await db.delete(users).where(eq(users.id, testId));

        const duration = Date.now() - start;

        return NextResponse.json({
            status: "success",
            message: "Database READ + WRITE successful",
            duration: `${duration}ms`,
            userCount: result.length,
            writeTest: "Passed",

            url_prefix: process.env.TURSO_DATABASE_URL?.split(':')[0],
            token_length: process.env.TURSO_AUTH_TOKEN?.length
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
