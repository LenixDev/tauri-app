import { DataTable } from "@/components/users/rows"
import { useColumns } from "@/components/users/columns"
import { useUsers } from "@/hooks/use-users"
import type { UserAccount } from "@/types"
import { useTranslation } from "react-i18next"
import { isRole } from "@/lib"

export const UsersTable = () => {
  const { t } = useTranslation()
  const data: UserAccount[] = useUsers().map(user => {
    const alias = t(`roles_alias.${user.role}`)
    const role = isRole(alias) ? alias : user.role
    return { ...user, role }
  })
  const columns = useColumns()

  return (
    <div className="max-w-4/5 container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}