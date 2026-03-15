import type { Session } from "@supabase/supabase-js"
import type { User } from "@/lib/user"
import type { Database } from './_database'
import type { Direction } from "radix-ui"

export type Role = Database['public']['Tables']['users']['Row']['role']
export type Permission = Database["public"]["Enums"]["user_permissions"]


export type AuthState =
  | { status: 'loading'; session: undefined; user: undefined }
  | { status: 'unauthenticated'; session: null; user: null }
  | { status: 'authenticated'; session: Session; user: User }

export type Response<T = string, U = undefined> = Promise<[boolean, T, Record<string, U>?]>

export type IDirectionProvider = React.ComponentProps<typeof Direction.DirectionProvider>
export type Email = `${number}@institutte.local`
export interface UserEmail {
  email: Email
}