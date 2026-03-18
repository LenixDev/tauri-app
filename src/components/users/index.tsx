import { DataTable } from "@/components/users/rows"
import { useColumns } from "@/components/users/columns"
import { useUsers } from "@/hooks/use-users"
import type { UserAccount } from "@/types"

export const UsersPage = () => {
  const data: UserAccount[] = useUsers()
  const columns = useColumns()

  return (
    <div className="max-w-4/5 container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}