import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { toast } from "sonner"

export const LoginForm = () => {
  const [identification, setIdentification] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email: `${identification}@institute.fake`,
      password
    })
    if (error) toast.error(error.message)
    toast.success(`Log in successful with #${identification}`)
  }
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
          {/* @TODO: add explaination where we can find the id */}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="login-form" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="id">Identification Number</Label>
              <Input
                value={identification} onChange={e => setIdentification(e.target.value)}
                name="id"
                type="number"
                placeholder="6901120"
                required
                /* strict within nim and max */
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  /* implement the logic */
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input value={password} onChange={e => setPassword(e.target.value)} name="password" type="password" required />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button form="login-form" type="submit" className="w-full">
          Login
        </Button>
      </CardFooter>
    </Card>
  )
}
