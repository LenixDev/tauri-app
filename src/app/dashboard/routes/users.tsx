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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@/hooks/use-user"
import React, { useState } from "react"
import { toast } from "sonner"
import type { Role } from "@/types"
import { useTranslation } from "react-i18next"

export const Users = () => {
  const [{ id, role, password, confirmPassword }, setUser] = useState<{
    id: string
    role: Role
    password: string
    confirmPassword: string
  }>({
    id: "",
    role: "student" satisfies Role,
    password: "",
    confirmPassword: "",
  })
  const user = useUser()
  const { t } = useTranslation()

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    const [success, result, data] = await user.createUser({
      identifier: id, confirmPassword, password, role
    })
    if (!success) {
      toast.error(result)
      return
    }
    toast.success(t(result, data))
  }
  return ( 
    <div className="h-full flex items-center justify-center"><Dialog><form id="dialog" onSubmit={void handleSubmit}>
      <DialogTrigger asChild><Button variant="outline">{t("signup.create_user")}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("signup.create_user")}</DialogTitle>
          <DialogDescription>
            {t("signup.enter_user_information")}
          </DialogDescription>
        </DialogHeader>
        {/* TODO: verify the credentials are correct */}
        <FieldGroup>
          <Field>
            <Label htmlFor="name">{t("identification")}</Label>
            <Input id="name" name="name" placeholder="6901120" 
              value={id}
              onChange={(event) => { setUser(prev => ({ ...prev, id: event.target.value })) }}
            />
          </Field>
          <Field>
            <Select onValueChange={(value) => { setUser(prev => ({ ...prev, role: value as Role })) }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("signup.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("signup.roles")}</SelectLabel>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <Field className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
                <Input id="password" type="password" required 
                  value={password}
                  onChange={(event) => { setUser(prev => ({ ...prev, password: event.target.value })) }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("signup.confirm_password")}
                </FieldLabel>
                <Input id="confirm-password" type="password" required 
                  value={confirmPassword}
                  onChange={(event) => { setUser(prev => ({ ...prev, confirmPassword: event.target.value })) }}
                />
              </Field>
            </Field>
            {/* TODO: add strong passwords requirement */}
            <FieldDescription>
              {t("signup.password_rule", { LENGTH: user.getPasswordLength })}
            </FieldDescription>
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">{t("cancel")}</Button></DialogClose>
          <Button type="submit" form="dialog">{t("create")}</Button>
        </DialogFooter>
      </DialogContent>
    </form></Dialog></div>
  )
}