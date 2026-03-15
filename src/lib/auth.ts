import type { TranslationKey } from "@/locales"
import { supabase } from "./supabase"
import type { Response } from "@/types"

export const signIn = async (
  identifier: string,
  password: string,
): Response<TranslationKey> => {
  const { error } = await supabase.auth.signInWithPassword({
    email: `${identifier}@institute.local`,
    password,
  })
  if (error) return [false, error.message]

  return [true, "alerts.signin_success"]
}
