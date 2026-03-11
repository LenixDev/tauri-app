import type { Session, UserAppMetadata } from "@supabase/supabase-js"
import { User } from "./user"

export type AuthState = {
  session: Session | null | undefined
  user: UserAppMetadata
}