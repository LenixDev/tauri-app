import { supabase } from "@/lib/supabase"
import { User } from "@/lib/user"
import type { Events, UserAccount } from "@/types"
import { useState, useEffect } from "react"

export const useUsers = () => {
  const [users, setUsers] = useState<UserAccount[]>([])

  useEffect(() => {
    const handler = () => {
      User.getUsers()
        .then(([success, data]) => {
          if (success && Array.isArray(data)) setUsers(data)
        })
        .catch(() => undefined)
    }
    handler()
    const channel = supabase
      .channel("db-changes")
      .on("broadcast", { event: "users-management" satisfies Events }, handler)
      .subscribe()

    return () => {
      supabase.removeChannel(channel).catch(() => undefined)
    }
  }, [])

  return users
}
