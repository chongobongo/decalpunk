import { UserRole } from "@/db/schemaDB";
import { insertUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic'; // ✅ opt out of static analysis

function parseRole(role: unknown): UserRole {
  if (role === "member" || role === "admin") return role;
  return "user";
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (user == null) return new Response("User not found", { status: 500 });

  if (user.fullName == null) {
    return new Response("User name missing", { status: 500 });
  }

  if (user.primaryEmailAddress?.emailAddress == null) {
    return new Response("User email missing", { status: 500 });
  }

  const dbUser = await insertUser({
    clerkUserId: user.id,
    name: user.fullName,
    email: user.primaryEmailAddress.emailAddress,
    imageUrl: user.imageUrl,
    role: parseRole(user.publicMetadata.role),
  });

  await syncClerkUserMetadata(dbUser);

  // ✅ Safely fall back if referer header is absent
  const referer = request.headers.get("referer") ?? "/";
  return NextResponse.redirect(referer);
}