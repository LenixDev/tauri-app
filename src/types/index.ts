import type { Session } from "@supabase/supabase-js"
import { User } from "@/lib/user"

import type { Database } from './database'

export type Role = Database['public']['Tables']['profiles']['Row']['role']
export const ROLES = ['manager', 'student'] as const satisfies Role[]

export const isRole = (value: string): value is Role =>
  (ROLES as readonly string[]).includes(value)

export type AuthState =
  | { status: 'loading'; session: undefined; user: undefined }
  | { status: 'unauthenticated'; session: null; user: null }
  | { status: 'authenticated'; session: Session; user: User }

export type Response = Promise<[boolean, string]>