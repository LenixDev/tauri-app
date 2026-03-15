import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import { UserInfo } from "@/types"
import { useState, useEffect } from "react"

export const useUsers = () => {
  const [users, setUsers] = useState<UserInfo[]>([])

  useEffect(() => {
    const handler = () => {
      User.getUsers().then(([success, data]) => {
        if (success && Array.isArray(data)) setUsers(data)
      }).catch(() => undefined)
    }
    handler()

    const channel = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, handler)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'role_permissions' }, handler)
      .subscribe()

    return () => { supabase.removeChannel(channel).catch(() => undefined) }
  }, [])

  return users
}