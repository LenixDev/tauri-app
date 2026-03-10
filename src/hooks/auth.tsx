import { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import { AuthState } from "@/lib/types"

const AuthContext = createContext<AuthState>({ session: undefined, user: undefined })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ session: undefined, user: undefined })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState({ session: null, user: null })
        return
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('identification, role')
        .eq('id', session.user.id)
        .single()

      if (error) {
        setState({ session, user: null })
        return
      }

      setState({ session, user: new User(session.user.id, data.identification, data.role) })
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)