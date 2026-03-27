import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublic = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/clerk/syncUsers",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  const alreadySynced = request.cookies.get("synced")?.value === "true";

  if (
    userId != null &&
    sessionClaims?.dbId == null &&
    !alreadySynced &&
    !request.nextUrl.pathname.includes("syncUsers")
  ) {
    return NextResponse.redirect(new URL("/api/clerk/syncUsers", request.url));
  }

  if (!isPublic(request)) {
    await auth.protect();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};