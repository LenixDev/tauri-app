import { createContext } from "react"
import type { AuthState } from "@/types"

export const AuthContext = createContext<AuthState>({
  status: "loading",
  user: undefined,
})
