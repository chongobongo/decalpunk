import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { syncClerkUserMetadata } from "@/services/clerk"
import { deleteUser, insertUser, updateUser } from '@/features/users/db/users'
import { UserRole } from '@/db/schemaDB'
import { buildDisplayName } from '@/lib/displayName'

function parseRole(role: unknown): UserRole {
  if (role === "member" || role === "admin") return role;
  return "user";
}

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!SIGNING_SECRET) {
    throw new Error('Error: CLERK_WEBHOOK_SECRET is not set')
  }

  const wh = new Webhook(SIGNING_SECRET)

  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing Svix headers', { status: 400 })
  }

  // Raw body, exactly as Clerk sent it
  const body = await req.text()

  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error: Could not verify webhook:', err)
    return new Response('Error: Verification error', { status: 400 })
  }

  switch (evt.type) {
    case "user.created":
    case "user.updated": {
      const email = evt.data.email_addresses.find(
        e => e.id === evt.data.primary_email_address_id
      )?.email_address
      if (email == null) return new Response("No email", { status: 400 })

      const name = buildDisplayName({
        firstName: evt.data.first_name,
        lastName: evt.data.last_name,
        username: evt.data.username,
        email,
      })

      if (evt.type === "user.created") {
        const user = await insertUser({
          clerkUserId: evt.data.id,
          email,
          name,
          imageUrl: evt.data.image_url,
          role: "user",
        })
        await syncClerkUserMetadata({ ...user, clerkUserId: user.clerkUserId! })
      } else {
        await updateUser(
          { clerkUserId: evt.data.id },
          {
            email,
            name,
            imageUrl: evt.data.image_url,
            role: parseRole(evt.data.public_metadata.role),
          }
        )
      }
      break
    }
    case "user.deleted": {
      if (evt.data.id != null) {
        await deleteUser({ clerkUserId: evt.data.id })
      }
      break
    }
  }

  return new Response('Webhook received', { status: 200 })
}