import { useAuth } from "@/hooks/use-hook"
import { Navigate, Outlet } from "react-router"

export function Session() {
  const { session } = useAuth()
  if (session === undefined) return null
  if (session === null) return <Navigate to="/login" replace />
  return <Outlet />
}