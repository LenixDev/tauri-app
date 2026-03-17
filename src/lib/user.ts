import type { TranslationKey } from "@/locales"
import { supabase } from "./supabase"
import type {
  Role,
  Permission,
  Response,
  UserAccount,
  CreateUser,
  DeleteUser,
} from "@/types"
import { FunctionsHttpError } from "@supabase/supabase-js"

const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  manager: ["create:user"],
  student: [],
} as const

export class User {
  private static readonly IDENTIFIER_LENGTH = 7
  private static readonly PASSWORD_LENGTH = 8
  private readonly identifier: string
  private readonly role: Role

  public constructor(identifier: string, role: Role) {
    this.identifier = identifier
    this.role = role
  }

  public static get getPasswordLength(): number {
    return User.PASSWORD_LENGTH
  }

  public get getIdentifier(): string {
    return this.identifier
  }

  public static async createUser({
    identifier,
    role,
    password,
    confirmPassword,
  }: Readonly<{
    identifier: string
    role: Role
    password: string
    confirmPassword: string
  }>): Promise<Response<TranslationKey, string, number | string | undefined>> {
    if (identifier.length !== User.IDENTIFIER_LENGTH)
      return [
        false,
        "signup.identification_mismatch",
        { identifierLength: User.IDENTIFIER_LENGTH },
      ]
    if (password.length < User.PASSWORD_LENGTH)
      return [
        false,
        "signup.password_mismatch",
        { passwordLength: User.PASSWORD_LENGTH },
      ]
    if (password !== confirmPassword)
      return [false, "signup.passwords_unmatched"]

    const result: { error: Error | null } = await supabase.functions.invoke(
      "create-user",
      {
        body: {
          identifier,
          password,
          role,
        } as CreateUser,
      },
    )
    const { error } = result

    if (error) return await User.catchHttpError(error)
    return [true, "signup.success", { identifier }]
  }

  public static async signOut(): Response<TranslationKey> {
    const { error } = await supabase.auth.signOut({ scope: "local" })
    if (error) return [false, error.message]
    return [true, "alerts.logout_success"]
  }

  public static async getUsers(): Response<UserAccount[]> {
    const { data, error } = (await supabase.functions.invoke("get-users", {
      body: {},
    })) as { data: UserAccount[] | null; error: Error | null }
    if (error) return User.catchHttpError(error)

    if (!data) return [false, "signout.fetch_failed"]
    
    return [true, data]
  }

  public static async deleteUser(identifier: string): Response<TranslationKey> {
    const { data, error } = await supabase.functions.invoke("delete-user", {
      body: { identifier } as DeleteUser,
    })
    if (error) return User.catchHttpError(error)
    console.debug(data)
    return [true, "signout.delete_success", { identifier }]
  }

  private static async catchHttpError(
    error: Readonly<Error>,
  ): Promise<[false, string]> {
    if (error instanceof FunctionsHttpError) {
      const errorInstance: { context: { text: () => Promise<string> } } = error
      const message = await errorInstance.context.text()
      return [false, message]
    }
    return [false, error.message]
  }

  public can(permission: Permission): boolean {
    return ROLE_PERMISSIONS[this.role].includes(permission)
  }
}
