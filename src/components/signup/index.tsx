import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FieldGroup
} from "@/components/ui/field"
import React, { useState } from "react"
import { toast } from "sonner"
import { useTranslation } from "react-i18next"
import { User } from "@/lib/user"
import type { OnChange, Role } from "@/types"
import { Identifier } from "./identifier"
import { RoleSelector } from "./role"
import { Password } from "./password"

export const CreateUser = () => {
  const { t } = useTranslation()
  const onChange: OnChange = (key: string, value: string) => setUser(prev => ({ ...prev, [key]: value }))

  const [{ identifier, role, password, confirmPassword }, setUser] = useState<{
    identifier: string
    role: Role
    password: string
    confirmPassword: string
  }>({
    confirmPassword: "",
    identifier: "",
    password: "",
    role: "student" satisfies Role,
  })

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()

    const [success, result, data] = await User.createUser({
      confirmPassword,
      identifier,
      password,
      role,
    })
    if (!success) {
      toast.error(t(result, data))
      return
    }
    setUser({
      identifier: "",
      role: "student",
      password: "",
      confirmPassword: "",
    })
    toast.success(t(result, data))
  }
  return (
    /* TODO: improve submition and semantics */
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("signup.create_user")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm ">
        <DialogHeader>
          <DialogTitle>{t("signup.create_user")}</DialogTitle>
          <DialogDescription>
            {t("signup.enter_user_information")}
          </DialogDescription>
        </DialogHeader>
        <form id="dialog" className="gap-6"
          onSubmit={(event) => {
            handleSubmit(event).catch(() => undefined)
          }}
        >
          <FieldGroup>
            <Identifier {...{ identifier, setUser, onChange }} />
            <RoleSelector {...{ setUser, onChange }} />
            <Password {...{ password, confirmPassword, onChange }} />
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancel")}</Button>
          </DialogClose>
          <Button type="submit" form="dialog">
            {t("create")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}