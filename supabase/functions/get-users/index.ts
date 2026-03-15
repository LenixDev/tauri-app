import { sharedInit } from '../_shared/index.ts'

Deno.serve(async (req) => {
  const [success, response] = await sharedInit(req, 'read:users')
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })
  const emails: Array<{ email: string | undefined }> = users.map((user) => ({ email: user.email }))

  return Response.json(emails, { status: 200, headers: corsHeaders })
})