import type { Session } from "@supabase/supabase-js"
import type { User } from "@/lib/user"

import type { Database } from './_database'
import type { Direction } from "radix-ui"
import type { DASHBOARD_ROUTES } from "@/lib/routes"

export type Role = Database['public']['Tables']['users']['Row']['role']

export type AuthState =
  | { status: 'loading'; session: undefined; user: undefined }
  | { status: 'unauthenticated'; session: null; user: null }
  | { status: 'authenticated'; session: Session; user: User }

export type Response<T = string, U = undefined> = Promise<[boolean, T, Record<string, U>?]>

export type RouteDir = typeof DASHBOARD_ROUTES[number]["route"]

export type IDirectionProvider = React.ComponentProps<typeof Direction.DirectionProvider>

export type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:delete'