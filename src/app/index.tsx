import { AuthContext } from "@/contexts/auth"
import { useContext } from "react"
import { Navigate, Outlet } from "react-router"

export const App = () => {
  const auth = useContext(AuthContext)
  if (auth.status === "loading") return null
  if (auth.status === "unauthenticated") return <Navigate to="/login" replace />
  return <Outlet />
}
