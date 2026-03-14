import { createContext } from "react"
import type { AuthState } from "@/types"

export const AuthContext = createContext<AuthState>({ session: undefined, status: 'loading', user: undefined })