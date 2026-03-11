import { createContext } from "react"
import { AuthState } from "@/lib/types"

export const AuthContext = createContext<AuthState>({ status: 'loading', session: undefined, user: undefined })