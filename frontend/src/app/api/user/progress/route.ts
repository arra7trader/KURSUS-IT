import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// POST - Update progress (current level, track, completed levels)
export async function POST(request: Request) {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { levelId, track, completed } = body;

    try {
        // Get current user data
        const currentUser = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);

        if (!currentUser.length) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const updateData: any = {};

        // Update current level/path if provided
        if (levelId !== undefined) updateData.currentLevel = levelId;
        if (track !== undefined) updateData.currentPath = track;

        // Mark level as completed if completed=true
        if (completed && levelId) {
            const completedLevels = JSON.parse(currentUser[0].completedLevels || '[]');
            if (!completedLevels.includes(levelId)) {
                completedLevels.push(levelId);
                updateData.completedLevels = JSON.stringify(completedLevels);
            }
        }

        await db.update(users)
            .set(updateData)
            .where(eq(users.email, session.user.email));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Progress update error:', error);
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
    }
}

// GET - Get current progress
export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const result = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);

        if (!result.length) {
            return NextResponse.json({
                currentLevel: 'level-1',
                currentPath: 'analyst',
                completedLevels: []
            });
        }

        const completedLevels = JSON.parse(result[0].completedLevels || '[]');

        return NextResponse.json({
            currentLevel: result[0].currentLevel || 'level-1',
            currentPath: result[0].currentPath || 'analyst',
            completedLevels
        });
    } catch (error) {
        console.error('Get progress error:', error);
        return NextResponse.json({ error: 'Failed to get progress' }, { status: 500 });
    }
}
