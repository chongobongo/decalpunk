import { db } from "@/db/index"
import { UserRole, UsersTable } from "@/db/schemaDB"
import { getUserIdTag } from "@/features/users/db/cache"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { eq } from "drizzle-orm"
import { cacheTag } from "next/dist/server/use-cache/cache-tag"
import { headers } from "next/headers"

const client = await clerkClient()

export async function getCurrentUser({ allData = false } = {}) {
  const { userId, sessionClaims, redirectToSignIn } = await auth()

  const dbUser =
    allData && sessionClaims?.dbId != null
      ? await getUser(sessionClaims.dbId as string)
      : undefined

  return {
    clerkUserId: userId,
    userId: sessionClaims?.dbId as string | undefined,
    role: (dbUser?.role ?? sessionClaims?.role) as UserRole ?? "user", // 👈 prefer DB role
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
  return db.query.UsersTable.findFirst({
    where: eq(UsersTable.id, id),
  })
}