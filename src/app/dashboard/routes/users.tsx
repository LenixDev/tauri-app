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
import React, { useState } from "react"
import { toast } from "sonner"
import type { Role } from "@/types"
import { useTranslation } from "react-i18next"
import { User } from "@/lib/user"

export const Users = () => {
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
  const { t } = useTranslation()

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  const handleSubmit = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()

    const [success, result, data] = await User.createUser({
      confirmPassword, identifier, password, role
    })
    if (!success) {
      toast.error(result)
      return
    }
    toast.success(t(result, data))
  }
  return ( 
    <div className="h-full flex items-center justify-center"><Dialog><form id="dialog" onSubmit={(event) => { handleSubmit(event) }}>
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
            <Label htmlFor="identifier">{t("identification")}</Label>
            <Input id="identifier" name="identifier" placeholder="6901120" 
              value={identifier}
              onChange={(event) => { setUser(prev => ({ ...prev, identifier: event.target.value })) }}
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
              {t("signup.password_rule", { LENGTH: User.getPasswordLength })}
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