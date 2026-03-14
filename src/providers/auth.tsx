import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import type { AuthState, Role } from "@/types"
import { AuthContext } from "@/contexts/auth"

export const AuthProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [state, setState] = useState<AuthState>({ session: undefined, status: 'loading', user: undefined })

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState({ session: null, status: 'unauthenticated', user: null })
        return
      }

      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single<{ role: Role }>()

      if (error) {
        setState({ session: null, status: 'unauthenticated', user: null })
        return
      }
      // TODO: cast the data.role type
      const userInstance = new User(session.user.email, data.role)
      setState({ session, status: 'authenticated', user: userInstance })
    })

    return (): void => { subscription.unsubscribe() }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}