"use client"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/button"
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Dialog } from "./ui/dialog"
import { FieldGroup } from "./ui/field"
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select } from "./ui/select"
import { User } from "@/lib/user"
import { useState } from "react"

export function DeleteUser() {
  const { i18n: { dir: dirFn, language }, t } = useTranslation()
  const dir = dirFn()
  const [selectedFruit, setSelectedFruit] = useState<string>("")

  const usersSet: { label: number, value: number }[] = []
  
  const handlePeak = async (bool: boolean) => {
    if (!bool) return
    const [success, users] = await User.getUsers()
    if (!success) return
    Object.entries(users).map(user => {
      usersSet.push({ label: user[1].identifier, value: user[1].identifier })
    })
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
  }

  return (
    <Dialog>
      <form id="delete-user" onSubmit={handleSubmit}>
        <DialogTrigger asChild>
          <Button variant="outline">{t("signout.delete")}</Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-sm"
          dir={dir}
          data-lang={dir === "rtl" ? language : undefined}
        >
          <DialogHeader>
            <DialogTitle>{t("signout.title")}</DialogTitle>
            <DialogDescription>{t("signout.description")}</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Select onOpenChange={async (open) => await handlePeak(open)} value={selectedFruit} onValueChange={setSelectedFruit}>
              <SelectTrigger className="w-32" dir={dir}>
                <SelectValue placeholder={t("selectFruit")} />
              </SelectTrigger>
              <SelectContent dir={dir} data-lang={dir === "rtl" ? language : undefined}>
                <SelectGroup>
                  <SelectLabel>{t("identifications numbers")}</SelectLabel>
                  {usersSet.map((user) => (
                    <SelectItem key={user.value} value={user.value.toString()}>
                      {user.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button form="delete-user" type="submit">{t("signout.delete")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
