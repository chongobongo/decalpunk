// Clerk

import { db } from "@/db/index"
import { UserRole, UsersTable } from "@/db/schemaDB"
import { getUserIdTag } from "@/features/users/db/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { headers } from "next/headers"

const client = await clerkClient()

const roles = ["user", "member", "admin"] as const

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  const dbUser =
    allData && sessionClaims?.dbId != null
      ? await getUser(sessionClaims.dbId as string)
      : undefined

  const candidate = dbUser?.role ?? sessionClaims?.appRole
  const role: UserRole = roles.includes(candidate as any)
    ? (candidate as UserRole)
    : "user"

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId as string | undefined,
    role,
    user: dbUser,
    redirectToSignIn,
  }
}

export function syncClerkUserMetadata(user: {
  id: string
  clerkUserId: string
  role: UserRole
}) {
  return client.users.updateUserMetadata(user.clerkUserId, {
    publicMetadata: {
      dbId: user.id,
      role: user.role,
    },
  })
}

async function getUser(id: string) {
  "use cache"
  cacheTag(await getUserIdTag(id))
  console.log("Called")
  try {
    return await db.query.UsersTable.findFirst({
      where: eq(UsersTable.id, id),
    })
  } catch (e) {
    const cause = (e as any).cause
    throw new Error(
      `getUser failed: ${cause?.code ?? ""} ${cause?.message ?? String(e)}`
    )
  }
}