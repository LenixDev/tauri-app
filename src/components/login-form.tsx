import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"

export const LoginForm = ({
  className,
}: React.ComponentProps<"form">) => {
  const [identification, setIdentification] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email: `${identification}@institute.fake`,
      password
    })
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(`Log in successful with #${identification}`)
    navigate('/dashboard')
  }
  return (
    <form className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Enter your credentials below to login to your account
            {/* @TODO: add explaination where we can find the id */}
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="id">Identification Number</FieldLabel>
          <Input
            value={identification}
            onChange={e => setIdentification(e.target.value)}
            id="id"
            type="number"
            placeholder="6901120"
            required
            className="bg-background"
            /* strict within nim and max */
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              /* implement the logic */
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            id="password"
            type="password"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <Button type="submit">Login</Button>
        </Field>
      </FieldGroup>
    </form>
  )
}
