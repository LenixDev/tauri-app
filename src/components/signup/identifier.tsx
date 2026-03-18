import { t } from "i18next"
import { Field, FieldLabel, FieldError } from "../ui/field"
import { Input } from "../ui/input"
import { User } from "@/lib/user"
import type { OnChange } from "@/types"
import { Star } from "../required"

export const Identifier = ({
  identifier,
  onChange,
}: {
  readonly identifier: string
  readonly onChange: OnChange
}) => {
  const isIdentifierInvalid =
    identifier.length > 0 && identifier.length !== User.static.identifier

  return (
    <Field data-invalid={isIdentifierInvalid}>
      <FieldLabel htmlFor="identifier">
        {t("identification")}
        <Star />
      </FieldLabel>
      <Input
        id="identifier"
        name="identifier"
        placeholder="6901120"
        aria-invalid={isIdentifierInvalid}
        value={identifier}
        type="number"
        onChange={(event) => {
          onChange("identifier", event.target.value)
        }}
        required
      />
      {isIdentifierInvalid && (
        <FieldError
          errors={[
            {
              message: t("signup.identification_mismatch", {
                identifierLength: User.static.identifier,
              }),
            },
          ]}
        />
      )}
    </Field>
  )
}
