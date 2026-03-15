import { sharedInit } from '../_shared/index.ts'
import { Role } from '../_shared/types.ts'


Deno.serve(async (req) => {
  const [success, response] = await sharedInit(req, 'read:users')
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const { data: profiles, error: postgresError } = await adminClient
    .from('users')
    .select('id, role').overrideTypes<Array<{ id: string, role: Role }>>()
  if (postgresError) return new Response(postgresError.message, { status: 400, headers: corsHeaders })

  const usersData = users.flatMap((user) => {
    const profile = profiles.find((p) => p.id === user.id)
    if (!profile) return []
    return [{ email: user.email, role: profile.role }]
  })

  return Response.json(usersData, { status: 200, headers: corsHeaders })
})