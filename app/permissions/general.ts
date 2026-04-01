import { UserRole } from "@/db/schemaDB"

// Pages Access
export function canAccessAdminPages({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

// Create Order
export function canCreateOrder({ role }: { role: UserRole | undefined }) {
  return role === "user" || role === "member" || role === "admin"
}

// Nav Access
export function canAccessAdminNav({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

export function canAccessMemberNav({ role }: { role: UserRole | undefined }) {
  return role === "member"
}

export function canAccessUserNav({ role }: { role: UserRole | undefined }) {
  return role === "user"
}
