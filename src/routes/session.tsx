import { Navigate, Outlet } from "react-router"
import { useSession } from "@/hooks/auth"

export function Session() {
  const session = useSession()
  if (session === undefined) return null
  if (session === null) return <Navigate to="/login" replace />
  return <Outlet />
}