import { useAuth } from "@/hooks/use-hook"
import { Navigate, Outlet } from "react-router"

export function Session() {
  const auth = useAuth()
  if (auth.status === 'loading') return null
  if (auth.status === 'unauthenticated') return <Navigate to="/login" replace />
  return <Outlet />
}