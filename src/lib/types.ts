import type { Session } from "@supabase/supabase-js"
import { User } from "./user"

export type AuthState = {
  session: Session | null | undefined
  user: User
}