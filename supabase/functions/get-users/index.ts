import { sharedInit } from '../_shared/index.ts'

Deno.serve(async (req) => {
  const [success, response] = await sharedInit(req, 'read:users')
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  return new Response(JSON.stringify(users), { status: 200, headers: corsHeaders })
})
