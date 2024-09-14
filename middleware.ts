import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { mockCurrentUser } from "./__mocks/user";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/forum(.*)",
  "/new-user(.*)",
  "/journal(.*)",
]);

export default clerkMiddleware((auth, req) => {
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
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
