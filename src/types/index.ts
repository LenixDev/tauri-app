import type { User } from "@/lib/user"
import type { Database } from "./_database"
import type { Direction } from "radix-ui"

export type Role = Database["public"]["Tables"]["users"]["Row"]["role"]
export type Permission = Database["public"]["Enums"]["user_permissions"]

export type AuthState =
  | { status: "loading"; user: undefined }
  | { status: "unauthenticated"; user: null }
  | { status: "unauthorized"; user: null }
  | { status: "authenticated"; user: User }

export type Response<T = unknown, F = string, U = string> = Promise<
  [true, T, Record<string, U>?] | [false, F, Record<string, U>?]
>

export type IDirectionProvider = React.ComponentProps<
  typeof Direction.DirectionProvider
>
export interface UserAccount {
  identifier: string
  role: "manager" | "student"
}

export type Events = "users-management"
export interface CreateUser {
  identifier: string
  role: Role
  password: string
}
export interface DeleteUser {
  identifier: string
}

export type OnChange = (key: string, value: string) => void