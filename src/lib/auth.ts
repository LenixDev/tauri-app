import { supabase } from "./supabase"

export const signIn = async(identifier: number, password: string) => {
  const { error } = await supabase.auth.signInWithPassword({
    email: `${identifier}@institute.local`,
    password
  })
  if (error) return [false, error.message]

  return [true, `Sign in successful with #${identifier}`]
}