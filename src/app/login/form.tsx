import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { signIn } from "@/lib/auth"
import { useTranslation } from "react-i18next"

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const LoginForm = ({
  className,
}: React.ComponentProps<"form">) => {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { t } = useTranslation()

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    const [success, result] = await signIn(identifier, password)
    if (!success) {
      toast.error(result)
      return
    }
    toast.success(t(result, { identifier }))
    navigate('/')
  }
  return (
    <form className={cn("flex flex-col gap-6", className)}
      onSubmit={(event) => { handleSubmit(event).catch(() => undefined) }}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">{t("login.title")}</h1>
          <p className="text-sm text-balance text-muted-foreground">
            {t("login.hint")}
            {/* TODO: add explaination where we can find the id */}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="id">{t("identification")}</FieldLabel>
          <Input
            value={identifier}
            onChange={event => { setIdentifier(event.target.value) }}
            id="id"
            type="number"
            placeholder="6901120"
            required
            className="bg-background"
            /* strict within nim and max */
          />
        </Field>
        <Field>
          {/* TODO: ignore the focus on forgot password when pressing tab */}
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
            <a
              /* TODO: implement the logic */
              href="#"
              className="text-sm underline-offset-4 hover:underline"
            >
              {t("login.forgotPassword")}
            </a>
          </div>
          <Input
            value={password}
            onChange={event => { setPassword(event.target.value) }}
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">{t("login.login")}</Button>
        </Field>
      </FieldGroup>
    </form>
    /* TODO: add translation btn */
  )
}
