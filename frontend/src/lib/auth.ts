import NextAuth from "next-auth"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import Credentials from "next-auth/providers/credentials"
import { v4 as uuidv4 } from "uuid"

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    session: { strategy: "jwt" },
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            name: "Guest Login",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                name: { label: "Name", type: "text", placeholder: "Your Name" },
            },
            authorize: async (credentials) => {
                if (!credentials?.email || !credentials?.name) return null;

                const email = credentials.email as string;
                const name = credentials.name as string;

                // Check if user exists
                const existingUsers = await db.select().from(users).where(eq(users.email, email)).limit(1);

                if (existingUsers.length > 0) {
                    return existingUsers[0];
                }

                // If not, create new user (Auto-registration for Guest mode)
                const newId = uuidv4();
                try {
                    await db.insert(users).values({
                        id: newId,
                        email,
                        name,
                        currentPath: 'ANALYST', // Default
                    });
                    return {
                        id: newId,
                        email,
                        name,
                    };
                } catch (error) {
                    console.error("Error creating user:", error);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        }
    }
})
