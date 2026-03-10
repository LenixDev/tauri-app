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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import React, { useState } from "react"
import { toast } from "sonner"

export const Users = () => {
  const [{
    id, password, confirmPassword
  }, setUser] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  })
  const handleSubmit = async (e: React.SyntheticEvent) => {
    console.log(true)
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    const { error } = await supabase.auth.admin.createUser({ id, password })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('User created successfully')
  }
  return ( 
    <div className="h-full flex items-center justify-center"><Dialog><form id="dialog" onSubmit={handleSubmit}>
      <DialogTrigger asChild><Button variant="outline">Create A New User</Button></DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create A New User</DialogTitle>
          <DialogDescription>
            Enter the user's information below to create his account
          </DialogDescription>
        </DialogHeader>
        {/* TODO: verify the credentials are correct */}
        <FieldGroup>
          <Field>
            <Label htmlFor="name">Identification Number</Label>
            <Input id="name" name="name" placeholder="6901120" 
              value={id}
              onChange={(e) => setUser(prev => ({ ...prev, id: e.target.value }))}
            />
          </Field>
          <Field>
            <Field className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input id="password" type="password" required 
                  value={password}
                  onChange={(e) => setUser(prev => ({ ...prev, password: e.target.value }))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="confirm-password">
                  Confirm Password
                </FieldLabel>
                <Input id="confirm-password" type="password" required 
                  value={confirmPassword}
                  onChange={(e) => setUser(prev => ({ ...prev, confirmPassword: e.target.value }))}
                />
              </Field>
            </Field>
            {/* TODO: add strong passwords requirement */}
            {/* <FieldDescription>
              Must be at least 8 characters long.
            </FieldDescription> */}
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button type="submit" form="dialog">Create</Button>
        </DialogFooter>
      </DialogContent>
    </form></Dialog></div>
  )
}