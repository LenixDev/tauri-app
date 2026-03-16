import type { Database } from './_database.ts'

export type Role = Database['public']['Tables']['users']['Row']['role']
export type Permission = Database["public"]["Enums"]["user_permissions"]
export type Events = "users-management"
export interface UsersData {
  id: string
  role: Role
}