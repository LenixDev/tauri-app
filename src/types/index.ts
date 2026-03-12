import type { Session } from "@supabase/supabase-js"
import type { User } from "@/lib/user"

import type { Database } from './_database'
import type { DASHBOARD_ROUTES } from "@/lib"
import type { Direction } from "radix-ui"

export type Role = Database['public']['Tables']['profiles']['Row']['role']
export const ROLES = ['manager', 'student'] as const satisfies Role[]

export const isRole = (value: string): value is Role =>
  (ROLES as readonly string[]).includes(value)

export type AuthState =
  | { status: 'loading'; session: undefined; user: undefined }
  | { status: 'unauthenticated'; session: null; user: null }
  | { status: 'authenticated'; session: Session; user: User }

export type Response = Promise<[boolean, string]>

export type RouteDir = typeof DASHBOARD_ROUTES[number]["route"]

export type IDirectionProvider = React.ComponentProps<typeof Direction.DirectionProvider>

export type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:delete'