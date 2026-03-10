import { supabase } from "./supabase"

type Role = 'director' | 'student'

type Permission =
  | 'users:create'
  | 'users:read'
  | 'users:delete'

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  director: ['users:create', 'users:read', 'users:delete'],
  student: [],
} as const

export class User {
  private readonly id: string
  private readonly identification: number
  private readonly role: Role

  constructor(id: string, identification: number, role: Role) {
    this.id = id
    this.identification = identification
    this.role = role
  }

  public static async signIn(identification: number, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email: `${identification}@institute.fake`,
      password
    })
    if (error) return [false, error.message]

    return [true, `Log in successful with #${identification}`]
  }

  public static async createUser(identification: string, password: string, confirmPassword: string) {
    if (password !== confirmPassword) return [false, "Passwords do not match"]
    const { error } = await supabase.functions.invoke('create-user', {
      body: { identification, password }
    })
    if (error) return [false, error.message]
    return [true, `User #${identification} created successfully`]
  }

  public can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }
}