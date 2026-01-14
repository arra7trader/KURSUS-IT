import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import Credentials from "next-auth/providers/credentials"
import { v4 as uuidv4 } from "uuid"
import { authConfig } from "../auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "Guest Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                name: { label: "Name", type: "text", placeholder: "Your Name" },
            },
            authorize: async (credentials) => {
                console.log('🔐 Authorize called with:', { email: credentials?.email, name: credentials?.name });

                if (!credentials?.email || !credentials?.name) {
                    console.error('❌ Missing credentials');
                    return null;
                }

                const email = credentials.email as string;
                const name = credentials.name as string;

                console.log('📧 Processing login for:', email);

                // Check if user exists
                try {
                    console.log('🔍 Querying database for existing user...');
                    const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);
                    console.log('✅ Database query successful. Found users:', existingUsers.length);

                    if (existingUsers.length > 0) {
                        console.log('👤 Returning existing user:', existingUsers[0].id);
                        return existingUsers[0];
                    }

                    // If not, create new user (Auto-registration for Guest mode)
                    console.log('➕ Creating new user...');
                    const newId = uuidv4();
                    await db.insert(users).values({
                        id: newId,
                        email,
                        name,
                        currentPath: 'ANALYST', // Default
                    });
                    console.log('✅ New user created:', newId);
                    return {
                        id: newId,
                        email,
                        name,
                    };
                } catch (error) {
                    console.error("❌ Database error in authorize:", error);
                    console.error("Error details:", JSON.stringify(error, null, 2));
                    return null;
                }
            }
        })
    ],
})
