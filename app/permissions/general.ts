import { UserRole } from "@/db/schemaDB"

export function canAccessAdminPages({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

export function canCreateOrder({ role }: { role: UserRole | undefined }) {
  return role === "user" || role === "member" || role === "admin"
}
