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
import React, { useEffect, useState } from "react"
import { toast } from "sonner"
import { Role } from "@/types"
import { t } from "i18next"

export const Users = () => {
  const [{ id, role, password, confirmPassword }, setUser] = useState<{
    id: string
    role: Role
    password: string
    confirmPassword: string
  }>({
    id: "",
    role: "student",
    password: "",
    confirmPassword: "",
  })
  const user = useUser()
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()

    const [success, result, data] = await user.createUser(id, role, password, confirmPassword)
    if (!success) {
      toast.error(result)
      return
    }
    toast.success(t(result, data))
  }
  return ( 
    <div className="h-full flex items-center justify-center"><Dialog><form id="dialog" onSubmit={handleSubmit}>
      <DialogTrigger asChild><Button variant="outline">{t("create_user")}</Button></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("create_user")}</DialogTitle>
          <DialogDescription>
            {t("enter_user_information")}
          </DialogDescription>
        </DialogHeader>
        {/* TODO: verify the credentials are correct */}
        <FieldGroup>
          <Field>
            <Label htmlFor="name">{t("identification")}</Label>
            <Input id="name" name="name" placeholder="6901120" 
              value={id}
              onChange={(e) => setUser(prev => ({ ...prev, id: e.target.value }))}
            />
          </Field>
          <Field>
            <Select onValueChange={(value) => setUser(prev => ({ ...prev, role: value as Role }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={t("role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("role")}</SelectLabel>
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
                  onChange={(e) => setUser(prev => ({ ...prev, password: e.target.value }))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  {t("confirm_password")}
                </FieldLabel>
                <Input id="confirm-password" type="password" required 
                  value={confirmPassword}
                  onChange={(e) => setUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </Field>
            </Field>
            {/* TODO: add strong passwords requirement */}
            <FieldDescription>
              {t("password_rule", { LENGTH: user.getPasswordLength })}
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