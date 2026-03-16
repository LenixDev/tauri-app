import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import type { AuthState, Email, Role } from "@/types"
import { AuthContext } from "@/contexts/auth"

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

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!session) {
        setState({ status: "unauthenticated", user: null })
        return
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single<{ role: Role }>()

      const {
        user: { email },
      }: { user: { email?: Email | undefined } } = session
      if (error || typeof email !== "string") {
        setState({ status: "unauthenticated", user: null })
        return
      }
      const userInstance = new User(email, data.role)
      setState({ status: "authenticated", user: userInstance })
    })

    return (): void => {
      subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}
