import { t } from "i18next"
import { Field } from "../ui/field"
import { isRole } from "@/lib"
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select } from "../ui/select"
import { OnChange } from "@/types"

export const RoleSelector = ({
  onChange
}: {
  onChange: OnChange
}) => {
  return (
    <Field>
      <Select
        defaultValue="student"
        onValueChange={(value) => isRole(value) && onChange("role", value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("signup.role")} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t("roles")}</SelectLabel>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}