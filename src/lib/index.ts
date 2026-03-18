import type { Permission, Role } from "@/types"

export const INSTITUTE_LOGO =
  "https://graph.facebook.com/insfpmohammadia/picture?type=large"

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ["create:user", "read:users", "delete:user"],
  student: [],
} as const

export const isRole = (value: string): value is Role =>
  (Object.keys(ROLE_PERMISSIONS) as readonly string[]).includes(value)