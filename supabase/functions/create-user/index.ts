import { UserConnection } from '../_shared/index.ts'
import type { CreateUser } from '../_shared/types.ts'

Deno.serve(async (req) => {
  const connection = new UserConnection(req)
  const [success, response] = await connection.connect('create:user')
  if (!success) return response
  const { client, priviledged, corsHeaders, sendDbBroadcastChanges } = response

  const { identifier, role, password }: CreateUser = await req.json()

  /* Check if the user already exists before creating it */
  const { data: user, error: clientError } = await client
    .from('users')
    .select('id')
    .eq('identifier', identifier)
    .maybeSingle<{ id: string }>()
  if (clientError) return new Response(clientError.message, { status: 400, headers: corsHeaders })
  if (user?.id) return new Response('User already exists', { status: 400, headers: corsHeaders })

  const { data, error } = await priviledged.auth.admin.createUser({
    email: `${identifier}@institute.local`,
    password,
    email_confirm: true,
  })
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const { error: profileError } = await priviledged
    .from('users')
    .insert({ id: data.user.id, identifier, role })
  if (profileError) return new Response(profileError.message, { status: 400, headers: corsHeaders })

  const [ok, result] = await sendDbBroadcastChanges()
  if (!ok) return result

  return new Response('OK', { status: 200, headers: corsHeaders })
})