import { createClient } from '@supabase/supabase-js'

export const supabase = (() => {
  const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_PUBLIC } = import.meta.env
  if (!VITE_SUPABASE_URL) throw new Error('SUPABASE_URL is not defined')
  if (!VITE_SUPABASE_ANON_PUBLIC) throw new Error('VITE_SUPABASE_ANON_PUBLIC is not defined')

  return createClient(VITE_SUPABASE_URL as string, VITE_SUPABASE_ANON_PUBLIC as string)
})()