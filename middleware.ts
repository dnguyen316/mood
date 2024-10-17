import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { mockCurrentUser } from "./__mocks/user";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { isAPIPath } from "./app/libs/function";
import { ratelimit } from "./app/libs/limter";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
  "/new-user(.*)",
  "/journal(.*)",
]);

export default clerkMiddleware(
  async (auth, req: NextRequest, event: NextFetchEvent) => {
    //Rate limit apis.
    if (
      isAPIPath(req.nextUrl.pathname) &&
      req.nextUrl.pathname !== "/api/blocked"
    ) {
      const ip = req.ip ?? "127.0.0.1";
      const { success, pending, limit, reset, remaining } =
        await ratelimit.limit(`ratelimit_middleware_${ip}`);
      event.waitUntil(pending);

      const res = success
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/api/blocked", req.url));

      res.headers.set("X-RateLimit-Limit", limit.toString());
      res.headers.set("X-RateLimit-Remaining", remaining.toString());
      res.headers.set("X-RateLimit-Reset", reset.toString());
      return res;
    }

    if (isProtectedRoute(req)) {
      // Check if the app is running in development mode
      const isDev = process.env.NODE_ENV === "development";

      // Use Clerk authentication in production, or mock authentication in development
      let authData;

      if (isDev) {
        // Mock the user in development mode
        authData = { userId: mockCurrentUser().id };
        console.log("Mocking user in development:", mockCurrentUser());
        const { userId } = authData || {};

        // If no user is authenticated, redirect to the login page
        if (!userId) {
          const loginUrl = new URL("/sign-in", req.url);
          return NextResponse.redirect(loginUrl);
        }

        // Continue with the request if user is authenticated
        return NextResponse.next();
      } else {
        auth().protect();
      }
    }
  }
);

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
