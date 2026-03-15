import type { Role } from "@/types"

export const ROLES = ["manager", "student"] as const satisfies Role[]
export const isRole = (value: string): value is Role =>
  (ROLES as readonly string[]).includes(value)

export const INSTITUTE_LOGO =
  "https://graph.facebook.com/insfpmohammadia/picture?type=large"
