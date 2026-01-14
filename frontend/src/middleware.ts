import { auth } from "@/lib/auth";

export default auth((req: any) => {
    const isLoggedIn = !!req.auth;
    const isLearningPage = req.nextUrl.pathname.startsWith("/learn");

    if (isLearningPage && !isLoggedIn) {
        return Response.redirect(new URL("/login", req.nextUrl));
    }
});

export const config = {
    matcher: ["/learn/:path*"],
};
