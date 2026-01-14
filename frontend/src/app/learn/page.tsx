import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function LearnRedirectPage({ searchParams }: { searchParams: { track?: string } }) {
    const session = await auth();

    if (!session?.user?.email) {
        redirect("/login");
    }

    // If track is specified in URL (from login redirect), update it
    if (searchParams?.track) {
        await db.update(users)
            .set({ currentPath: searchParams.track.toUpperCase() })
            .where(eq(users.email, session.user.email));
    }

    const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);

    // Default to 'analyst' and 'level-1' if not set
    const track = (user[0]?.currentPath || 'analyst').toLowerCase();
    const level = user[0]?.currentLevel || 'level-1';

    console.log(`Redirecting user ${session.user.name} to /learn/${track}/${level}`);

    redirect(`/learn/${track}/${level}`);
}
