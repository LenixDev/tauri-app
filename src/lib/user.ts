import type { TranslationKey } from "@/locales"
import { supabase } from "./supabase"
import type { Role, Permission, Response } from "@/types"
import { FunctionsHttpError } from "@supabase/supabase-js"

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ['users:create', 'users:read', 'users:delete'],
  student: [],
} as const

export class User {
  private static readonly IDENTIFIER_LENGTH = 7
  private static readonly PASSWORD_LENGTH = 8
  private readonly email: string | undefined
  private readonly role: Role

  public constructor(email: string | undefined, role: Role) {
    this.email = email
    this.role = role
  }

  public static get getPasswordLength(): number {
    return User.PASSWORD_LENGTH
  }

  public get identifier(): number {
    if (this.email === undefined) throw new Error("Email is undefined")
    return parseInt(this.email.split('@')[0], 10)
  }

  public static async createUser({
    identifier, role, password, confirmPassword
  }: Readonly<{
    identifier: string, role: Role, password: string, confirmPassword: string
  }>): Response {
    if (identifier.length !== User.IDENTIFIER_LENGTH) return [
      false, 
      "signup.identification_mismatch" satisfies TranslationKey, 
      { identifierLength: User.IDENTIFIER_LENGTH }
    ]
    if (password.length < User.PASSWORD_LENGTH) return [
      false, 
      "signup.password_mismatch" satisfies TranslationKey, 
      { passwordLength: User.PASSWORD_LENGTH }
    ]
    if (password !== confirmPassword) return [
      false, "signup.passwords_unmatched" satisfies TranslationKey
    ]

    const result: { error: Error | null } = await supabase.functions.invoke('create-student', { body: { 
      identifier: parseInt(identifier, 10), password, role
    } })
    const { error } = result

    if (error) return User.catchHttpError(error)
    return [true, "signup.success" satisfies TranslationKey, { identifier }]
  }

  public static async signOut(): Response {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) return [false, error.message]
    return [true, "alerts.logout_success" satisfies TranslationKey]
  }

  private static async catchHttpError(error: Error): Promise<Response> {
    if (error instanceof FunctionsHttpError) {
      const errorInstance: { context: { text: () => Promise<string> }} = error
      const { text } = errorInstance.context
      const message = await text()
      return [false, message]
    }
    return [false, error.message]
  }

  public can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }
}