import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        console.log('🔄 Starting migration via API...');

        // Use raw SQL to add the column
        // We use try-catch specifically for the alter table in case it exists
        try {
            await db.run(sql`ALTER TABLE users ADD COLUMN completed_levels TEXT`);
            console.log('✅ Column completed_levels added.');
        } catch (e: any) {
            console.log('ℹ️ Column might already exist or error:', e.message);
        }

        // Initialize nulls
        await db.run(sql`UPDATE users SET completed_levels = '[]' WHERE completed_levels IS NULL`);
        console.log('✅ Nulls initialized.');

        return NextResponse.json({ success: true, message: 'Migration executed' });
    } catch (error: any) {
        console.error('❌ Migration API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
