import { createClient } from "@supabase/supabase-js"

export const supabase = (() => {
  const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_PUBLIC } = import.meta.env
  if (typeof VITE_SUPABASE_URL !== "string")
    throw new Error("VITE_SUPABASE_URL is not defined")
  if (typeof VITE_SUPABASE_ANON_PUBLIC !== "string")
    throw new Error("VITE_SUPABASE_ANON_PUBLIC is not defined")

  return createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_PUBLIC)
})()
