import { t } from "i18next"
import { Field, FieldLabel, FieldError } from "../ui/field"
import { Input } from "../ui/input"
import { User } from "@/lib/user"
import { OnChange } from "@/types"
import { Star } from "../required"

export const Identifier = ({
  identifier, onChange
}: {
  identifier: string
  onChange: OnChange
}) => {
  const isIdentifierInvalid = identifier.length > 0 && identifier.length < 7 || identifier.length > 7
  
  return (
    <Field data-invalid={isIdentifierInvalid}>
      <FieldLabel htmlFor="identifier">{t("identification")}<Star /></FieldLabel>
      <Input
        id="identifier"
        name="identifier"
        placeholder="6901120"
        aria-invalid={isIdentifierInvalid}
        value={identifier}
        type="number"
        onChange={(event) => onChange("identifier", event.target.value)}
      />
      {isIdentifierInvalid && (
        <FieldError errors={[
          { message: t("signup.identification_mismatch", { identifierLength: User.getPasswordLength }) }
        ]} />
      )}
    </Field>
  )
}