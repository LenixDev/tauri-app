"use client"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/button"
import { DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Dialog } from "./ui/dialog"
import { FieldGroup } from "./ui/field"
import React from "react"
import { SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem, Select } from "./ui/select"
import { User } from "@/lib/user"

export function DeleteUser() {
  const { i18n: { dir: dirFn, language }, t } = useTranslation()
  const dir = dirFn()
  const [selectedFruit, setSelectedFruit] = React.useState<string>("")

  // const fruits = [
  //   { label: t.apple, value: "apple" },
  //   { label: t.banana, value: "banana" },
  //   { label: t.blueberry, value: "blueberry" },
  //   { label: t.grapes, value: "grapes" },
  //   { label: t.pineapple, value: "pineapple" },
  // ]

  // const vegetables = [
  //   { label: t.carrot, value: "carrot" },
  //   { label: t.broccoli, value: "broccoli" },
  //   { label: t.spinach, value: "spinach" },
  // ]

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const [success, users] = await User.getUsers()
    console.log(success, users)
  }

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
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
            <Select value={selectedFruit} onValueChange={setSelectedFruit}>
              <SelectTrigger className="w-32" dir={dir}>
                <SelectValue placeholder={t("selectFruit")} />
              </SelectTrigger>
              <SelectContent dir={dir} data-lang={dir === "rtl" ? language : undefined}>
                <SelectGroup>
                  <SelectLabel>{t("fruits")}</SelectLabel>
                  {/* {fruits.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))} */}
                </SelectGroup>
              </SelectContent>
            </Select>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{t("cancel")}</Button>
            </DialogClose>
            <Button type="submit">{t("signout.delete")}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
