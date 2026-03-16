import type { Session } from "@supabase/supabase-js"
import type { User } from "@/lib/user"
import type { Database } from "./_database"
import type { Direction } from "radix-ui"

export type Role = Database["public"]["Tables"]["users"]["Row"]["role"]
export type Permission = Database["public"]["Enums"]["user_permissions"]

export type AuthState =
  | { status: "loading"; session: undefined; user: undefined }
  | { status: "unauthenticated"; session: null; user: null }
  | { status: "authenticated"; session: Session; user: User }

export type Response<T = unknown, F = string, U = undefined> = Promise<
  [true, T, Record<string, U>?] | [false, F, Record<string, U>?]
>

export type IDirectionProvider = React.ComponentProps<
  typeof Direction.DirectionProvider
>
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type Email = `${number}@institutte.local` | string
export interface UserData {
  email: string | undefined
  role: "manager" | "student"
}
export interface UserInfo extends Omit<UserData, "email"> {
  identifier: number
}

export type Events = "users-management"