import { UserConnection } from '../_shared/index.ts'

Deno.serve(async (req) => {
  const [success, response] = await new UserConnection(req, 'delete:user').connect()
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { id }: { id: string } = await req.json()
  const { error } = await adminClient.auth.admin.deleteUser(id, true)
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  return new Response("OK", { status: 200, headers: corsHeaders })
})