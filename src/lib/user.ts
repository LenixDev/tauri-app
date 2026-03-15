import type { TranslationKey } from "@/locales"
import { supabase } from "./supabase"
import type { Role, Permission, Response, Email, UserData, UserInfo } from "@/types"
import { FunctionsHttpError } from "@supabase/supabase-js"

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ['create:user'],
  student: [],
} as const

export class User {
  private static readonly IDENTIFIER_LENGTH = 7
  private static readonly PASSWORD_LENGTH = 8
  private readonly email: Email
  private readonly role: Role

  public constructor(email: Email, role: Role) {
    this.email = email
    this.role = role
  }

  public static get getPasswordLength(): number {
    return User.PASSWORD_LENGTH
  }

  public get identifier(): number {
    return User.identifierFromEmail(this.email)
  }

  public static async createUser({
    identifier, role, password, confirmPassword
  }: Readonly<{
    identifier: string, role: Role, password: string, confirmPassword: string
  }>): Response<string, TranslationKey | string, number | string | undefined> {
    if (identifier.length !== User.IDENTIFIER_LENGTH) return [
      false, 
      "signup.identification_mismatch", 
      { identifierLength: User.IDENTIFIER_LENGTH }
    ]
    if (password.length < User.PASSWORD_LENGTH) return [
      false,
      "signup.password_mismatch", 
      { passwordLength: User.PASSWORD_LENGTH }
    ]
    if (password !== confirmPassword) return [false, "signup.passwords_unmatched"]

    const result: { error: Error | null } = await supabase.functions.invoke('create-user', { body: { 
      identifier: parseInt(identifier, 10), password, role
    } })
    const { error } = result

    if (error) return User.catchHttpError(error)
    return [true, "signup.success", { identifier }]
  }

  public static async signOut(): Response {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    if (error) return [false, error.message]
    return [true, "alerts.logout_success"]
  }

  public static async getUsers(): Response<UserInfo[], string> {
    const { data, error } = await supabase.functions.invoke('get-users', {
      body: {}
    }) as { data: UserData[] | null, error: Error | null }
    if (error) return User.catchHttpError(error)

    if (!data) return [false, "signout.fetch_failed"]

    const identifiers = data.map(user => {
      if (!user.email) throw new Error("User email is undefined")
      return {
        identifier: User.identifierFromEmail(user.email),
        role: user.role
      }
    })
    return [true, identifiers]
  }

  // public static deleteUser(email: Email): Response {  }

  private static identifierFromEmail(email: Email): number {
    return parseInt(email.split('@')[0], 10)
  }

  private static async catchHttpError<T>(error: Readonly<Error>): Response<T, string> {
    if (error instanceof FunctionsHttpError) {
      const errorInstance: { context: { text: () => Promise<string> }} = error
      const message = await errorInstance.context.text()
      return [false, message]
    }
    return [false, error.message]
  }

  public can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }
}