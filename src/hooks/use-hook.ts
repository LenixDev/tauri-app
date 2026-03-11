import { useContext } from "react"
import { AuthContext } from "./auth-context"
import { User } from "@/lib/user"

export const useAuth = () => useContext(AuthContext)

export const useUser = (): User => {
  const auth = useContext(AuthContext)
  if (auth.status !== 'authenticated') throw new Error("useUser must be used within an authenticated route")
  return auth.user
}