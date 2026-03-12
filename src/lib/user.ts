import { supabase } from "./supabase"
import { Response } from "@/types"
import { Role } from "@/types"
import { FunctionsHttpError } from "@supabase/supabase-js"

type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:delete'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ['users:create', 'users:read', 'users:delete'],
  student: [],
} as const

export class User {
  private readonly email: string | undefined
  private readonly role: Role
  private readonly IDENTIFIER_LENGTH = 7
  private readonly PASSWORD_LENGTH = 8

  constructor(email: string | undefined, role: Role) {
    this.email = email
    this.role = role
    DEV: console.log("instance created with:", role)
  }

  get identifier(): number {
    if (!this.email) throw new Error("Email is undefined")
    return parseInt(this.email.split('@')[0])
  }

  get getPasswordLength(): number {
    return this.PASSWORD_LENGTH
  }

  public async createUser(identifier: string, role: Role, password: string, confirmPassword: string): Response {
    if (identifier.length !== this.IDENTIFIER_LENGTH) return [false, "Identification number must be exactly of 7 characters"]
    if (password.length < this.PASSWORD_LENGTH) return [false, "Password must be at least of 8 characters"]
    if (password !== confirmPassword) return [false, "Passwords do not match"]

    DEV: console.log("creation requested for:", identifier)
    const { data: { session } } = await supabase.auth.getSession()
    DEV: console.log('session:', session)
    const { error } = await supabase.functions.invoke('create-student', {
      body: { identifier: parseInt(identifier), role, password },
    })
    DEV: console.log("await passed for:", identifier, "error:", error)
    
    if (error) {
      if (error instanceof FunctionsHttpError) {
        const message = await error.context.text()
        return [false, message]
      }
      return [false, error.message]
    }
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