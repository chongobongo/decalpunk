import { db } from "@/db";
import { UserRole, UsersTable } from "@/db/schemaDB";
import { insertUser } from "@/features/users/db/users";
import { syncClerkUserMetadata } from "@/services/clerk";
import { buildDisplayName } from "@/lib/displayName";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

function parseRole(role: unknown): UserRole {
  if (role === "member" || role === "admin") return role;
  return "user";
}

export async function GET(request: Request) {
  const user = await currentUser();
  if (user == null) return new Response("User not found", { status: 500 });

  const email = user.primaryEmailAddress?.emailAddress
  if (email == null) return new Response("User email missing", { status: 500 });

  const name = buildDisplayName({
    fullName: user.fullName,
    firstName: user.firstName,
    lastName: user.lastName,
    username: user.username,
    email,
  })

  // Check if user already exists
  const existingUser = await db.query.UsersTable.findFirst({
    where: eq(UsersTable.clerkUserId, user.id),
  })

  const dbUser = await insertUser({
    clerkUserId: user.id,
    name,
    email,
    imageUrl: user.imageUrl,
    role: existingUser?.role ?? parseRole(user.publicMetadata.role), // preserve existing role
  });

  if (!dbUser.clerkUserId) {
    return new Response("User has no clerkUserId", { status: 400 });
  }

  await syncClerkUserMetadata({ ...dbUser, clerkUserId: dbUser.clerkUserId! });

  const origin = new URL(request.url).origin;
  const response = NextResponse.redirect(new URL("/", origin));
  response.cookies.set("synced", "true", { maxAge: 10 });
  return response;
}