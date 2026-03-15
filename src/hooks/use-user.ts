import { useContext } from "react"
import { AuthContext } from "../contexts/auth"
import type { User } from "@/lib/user"

export const useUser = (): User => {
  const auth = useContext(AuthContext)
  if (auth.status !== "authenticated")
    throw new Error("useUser must be used within an authenticated route")
  return auth.user
}
