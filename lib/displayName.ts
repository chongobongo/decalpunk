// lib/displayName.ts

// Always returns a usable name, even for email-only sign-ups
export function buildDisplayName(parts: {
  fullName?: string | null
  firstName?: string | null
  lastName?: string | null
  username?: string | null
  email?: string | null
}) {
  const full = parts.fullName?.trim()
  if (full) return full

  const joined = [parts.firstName, parts.lastName].filter(Boolean).join(" ").trim()
  if (joined) return joined

  const username = parts.username?.trim()
  if (username) return username

  const local = parts.email?.split("@")[0]?.trim()
  return local || "Customer"
}