import type { Database } from './_database.ts'

export type Role = Database['public']['Tables']['users']['Row']['role']
export type Permission = Database["public"]["Enums"]["user_permissions"]
export type Events = "users-management"
export type RealtimeRegisteration = () => Promise<[true] | [false, Response]>
export interface CreateUser {
  identifier: string
  role: Role
  password: string
}
export interface UserAccount {
  identifier: string
  role: Role
}
export interface DeleteUser {
  identifier: string
}