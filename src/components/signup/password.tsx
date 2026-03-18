import { t } from "i18next"
import { Field, FieldLabel, FieldDescription } from "../ui/field"
import { Input } from "../ui/input"
import zxcvbn from "zxcvbn"
import { User } from "@/lib/user"
import { OnChange } from "@/types"
import { Star } from "../required"

export const Password = ({
  password, confirmPassword, onChange
}: {
  password: string
  confirmPassword: string
  onChange: OnChange
}) => {
  const strength = zxcvbn(password),
    weaknessThreshold = 3
  const isWeak = strength.score < weaknessThreshold

  const widths = ["1%", "20%", "60%", "80%", "100%"]
  const colors = [
    "bg-red-500",
    "bg-red-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-500",
  ]
  const isConfirmed = password !== confirmPassword
  return(
    <Field>
      <Field className="grid grid-rows-2 gap-4">
        <Field>
          <FieldLabel htmlFor="password">{t("password")}<Star /></FieldLabel>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => onChange("password", event.target.value)}
          />
        </Field>
        <Field data-invalid={isConfirmed}>
          <FieldLabel htmlFor="confirm-password">
            {t("signup.confirm_password")}<Star />
          </FieldLabel>
          <Input
            id="confirm-password"
            type="password"
            required
            value={confirmPassword}
            onChange={(event) => onChange("confirmPassword", event.target.value)}
            aria-invalid={isConfirmed}
          />
        </Field>
      </Field>

      {password && (
        <>
          <div className="h-1 pb-1 w-full bg-muted rounded-full">
            <div
              className={`h-1 rounded-full transition-all ${colors[strength.score]}`}
              style={{ width: widths[strength.score] }}
            />
          </div>
          {isWeak && (
            <p className="text-destructive text-sm">
              {strength.feedback.suggestions[0]}
            </p>
          )}
        </>
      )}
      <FieldDescription>
        {t("signup.password_rule", { length: User.getPasswordLength })}
      </FieldDescription>
    </Field>
  )
}