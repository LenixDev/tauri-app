import type { Role } from '../_shared/types.ts'
import { sharedInit } from '../_shared/index.ts'

Deno.serve(async (req) => {
  const [success, response] = await sharedInit(req, 'create:user')
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { identifier, role, password }: {
    identifier: string, role: Role, password: string
  } = await req.json()

  const { data, error } = await adminClient.auth.admin.createUser({
    email: `${identifier}@institute.local`,
    password,
    email_confirm: true,
  })

  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const { error: profileError } = await adminClient
    .from('users')
    .insert({ id: data.user.id, role })

  if (profileError) return new Response(profileError.message, { status: 400, headers: corsHeaders })

  return new Response('OK', { status: 200, headers: corsHeaders })
})