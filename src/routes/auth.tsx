import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import { AuthState } from "@/lib/types"
import { AuthContext } from "../hooks/auth-context"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ status: 'loading', session: undefined, user: undefined })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState({ status: 'unauthenticated', session: null, user: null })
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('identification, role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        setState({ status: 'unauthenticated', session: null, user: null })
        return
      }

      const userInstance = new User(session.user.id, data.identification, data.role)
      setState({ status: 'authenticated', session, user: userInstance })
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}