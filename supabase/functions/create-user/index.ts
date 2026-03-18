import { UserConnection } from '../_shared/index.ts'
import type { CreateUser } from '../_shared/types.ts'

Deno.serve(async (req) => {
  const connection = new UserConnection(req)
  const [success, response] = await connection.connect('create:user')
  if (!success) return response
  const { client, corsHeaders, joinRealtimeEvents } = response

  const { identifier, role, password }: CreateUser = await req.json()

  const { data: user, error: clientError } = await client
    .from('users')
    .select('id')
    .eq('identifier', identifier)
    .single<{ id: string }>()
  if (clientError) return new Response(clientError.message, { status: 400, headers: corsHeaders })

  if (user.id) return new Response('User already exists', { status: 400, headers: corsHeaders })

  const { data, error } = await client.auth.admin.createUser({
    email: `${identifier}@institute.local`,
    password,
    email_confirm: true,
  })
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const { error: profileError } = await client
    .from('users')
    .insert({ id: data.user.id, identifier, role })
  if (profileError) return new Response(profileError.message, { status: 400, headers: corsHeaders })

  const [ok, result] = await joinRealtimeEvents()
  if (!ok) return result

  return new Response('OK', { status: 200, headers: corsHeaders })
})