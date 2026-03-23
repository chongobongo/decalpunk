import { UserRole } from "@/db/schemaDB"

export function canCreateCustomSticker({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

export function canUpdateCustomSticker({ role }: { role: UserRole | undefined }) {
  return role === "admin"
}

export function canDeleteCustomSticker({ role }: { role: UserRole | undefined }) {
    return role === "admin"
  }