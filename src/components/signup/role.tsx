import { t } from "i18next"
import { Field, FieldLabel } from "../ui/field"
import { isRole, ROLE_PERMISSIONS } from "@/lib"
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select } from "../ui/select"
import { OnChange } from "@/types"
import { Star } from "../required"

export const RoleSelector = ({
  onChange
}: {
  onChange: OnChange
}) => {
  return (
    <Field>
      <FieldLabel>{t("role")}<Star /></FieldLabel>
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
            {Object.keys(ROLE_PERMISSIONS).map(role => (
              <SelectItem key={role} value={role}>
                {t(`roles_alias.${role}`)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}