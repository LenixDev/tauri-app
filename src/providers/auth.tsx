import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import type { AuthState, UserAccount } from "@/types"
import { AuthContext } from "@/contexts/auth"
import type { Session } from "@supabase/supabase-js"

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const AuthProvider = ({
  children,
}: {
  readonly children: React.ReactNode
}) => {
  const [state, setState] = useState<AuthState>({
    status: "loading",
    user: undefined,
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const fetchUser = async (session: Readonly<Session>) => {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("role, identifier")
      .eq("id", session.user.id)
      .single<UserAccount>()

    if (userError) {
      setState({ status: "unauthenticated", user: null })
      return undefined
    }
    return user
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState({ status: "unauthenticated", user: null })
        return
      }

      if (Boolean(session.user.deleted_at)) {
        setState({ status: "unauthorized", user: null })
        return
      }

      const user = await fetchUser(session)
      if (!user) return

      const userInstance = new User(user.identifier, user.role)
      setState({ status: "authenticated", user: userInstance })
    })

    return (): void => {
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
