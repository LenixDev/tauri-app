import { supabase } from "./supabase"

export const signIn = async(identification: number, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: `${identification}@institute.local`,
    password
  })
  if (error) return [false, error.message]

  return [true, `Sign in successful with #${identification}`]
}