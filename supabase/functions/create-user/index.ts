import { UserConnection } from '../_shared/index.ts'
import type { CreateUser } from '../_shared/types.ts'

Deno.serve(async (req) => {
  const [success, response] = await new UserConnection(req, 'create:user').connect()
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { identifier, role, password }: CreateUser = await req.json()

  const { dadta: user, error: clientError } = await adminClient
    .from('users')
    .select('id')
    .eq('identifier', identifier)
    .single<{ id: string }>()
  if (clientError) return new Response(clientError.message, { status: 400, headers: corsHeaders })

  if (user.id) return new Response('User already exists', { status: 400, headers: corsHeaders })

  const { data, error } = await adminClient.auth.admin.createUser({
    email: `${identifier}@institute.local`,
    password,
    email_confirm: true,
  })
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const { error: profileError } = await adminClient
    .from('users')
    .insert({ id: data.user.id, identifier, role })
  if (profileError) return new Response(profileError.message, { status: 400, headers: corsHeaders })

  const [ok, result] = await response.registerToRealtime()
  if (!ok) return result

  return new Response('OK', { status: 200, headers: corsHeaders })
})