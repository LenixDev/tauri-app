import { useAuth } from "@/hooks/auth"
import { Navigate, Outlet } from "react-router"

export function Session() {
  const { session } = useAuth()
  if (session === undefined) return null
  if (session === null) return <Navigate to="/login" replace />
  return <Outlet />
}