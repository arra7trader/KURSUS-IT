import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { levelId, track } = await req.json();

        if (!levelId || !track) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Update user progress
        await db.update(users)
            .set({
                currentLevel: levelId,
                currentPath: track.toUpperCase(), // Store as ANALYST/SCIENTIST
                updatedAt: new Date()
            })
            .where(eq(users.email, session.user.email));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error saving progress:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);

    return NextResponse.json({
        currentLevel: user[0]?.currentLevel || 'level-1',
        currentPath: user[0]?.currentPath || 'ANALYST'
    });
}
