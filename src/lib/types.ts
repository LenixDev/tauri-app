import type { Session } from "@supabase/supabase-js"
import { User } from "./user"

export type Role = 'manager' | 'student'

export type AuthState =
  | { status: 'loading'; session: undefined; user: undefined }
  | { status: 'unauthenticated'; session: null; user: null }
  | { status: 'authenticated'; session: Session; user: User }

export type Response = Promise<[boolean, string]>