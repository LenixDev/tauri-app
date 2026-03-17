import { UserConnection } from '../_shared/index.ts'
import type { UserAccount } from '../_shared/types.ts'

Deno.serve(async (req) => {
  const connection = new UserConnection()
  const [success, response] = await connection.connect(req, 'read:users')
  if (!success) return response
  const { admin, corsHeaders } = response

  const { data: { users }, error } = await admin.auth.admin.listUsers()
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  /* Get the users's `role` and `id` from `public.users` */
  const { data: profiles, error: postgresError } = await admin
    .from('users')
    .select('id, role, identifier').overrideTypes<UserAccount[]>()
  if (postgresError) return new Response(postgresError.message, { status: 400, headers: corsHeaders })

  /* Security: only send wanted data */
  const usersData = users.flatMap((user) => {
    // remove the falsy value returned from the method `find` and filters out the soft deleted users
    const profile = profiles.find((p) => p.id === user.id && !user.deleted_at)
    if (!profile) return []
    return [{ identifier: profile.identifier, role: profile.role }]
  })

  return Response.json(usersData, { status: 200, headers: corsHeaders })
})