import { supabase } from "./supabase"
import { Response } from "./types"

type Role = 'manager' | 'student'

type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:delete'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ['users:create', 'users:read', 'users:delete'],
  student: [],
} as const

export class User {
  private readonly id: string
  private readonly role: Role

  constructor(id: string, role: Role) {
    this.id = id
    this.role = role
    DEV: console.log("instance created with:", id, role)
  }

  public async createUser(identifier: number, role: string, password: string, confirmPassword: string): Response {
    if (!Number.isInteger(identifier) || identifier < 0) return [false, "Identification is required"]
    if (password.length === 0) return [false, "Password is required"]
    if (password !== confirmPassword) return [false, "Passwords do not match"]

    console.log("creation requested for:", identifier)
    const { data: { session } } = await supabase.auth.getSession()
    console.log('session:', session)
    const { error } = await supabase.functions.invoke('create-student', {
      body: { identifier, role, password },
    })
    console.log("await passed for:", identifier, "error:", error)
    
    if (error) return [false, error.message]
    return [true, `User #${identifier} created successfully`]
  }

  public can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }

  public async signOut(): Response {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) return [false, error.message]
    return [true, "Logged out successfully"]
  }
}