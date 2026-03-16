import { UserConnection } from '../_shared/index.ts'
import { UserAccount } from '../_shared/types.ts'

Deno.serve(async (req) => {
  const [success, response] = await new UserConnection(req, 'read:users').connect()
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  /* Get the users's `role` and `id` from `public.users` */
  const { data: profiles, error: postgresError } = await adminClient
    .from('users')
    .select('id, role, identifier').overrideTypes<UserAccount[]>()
  if (postgresError) return new Response(postgresError.message, { status: 400, headers: corsHeaders })

  /* Security: only send wanted data */
  const usersData = users.flatMap((user) => {
    // just to remove the falsy value returned from the method `find`
    const profile = profiles.find((p) => p.id === user.id)
    if (!profile) return []
    return [{ identifier: profile.identifier, role: profile.role }]
  })

  return Response.json(usersData, { status: 200, headers: corsHeaders })
})