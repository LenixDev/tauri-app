import { UserConnection } from '../_shared/index.ts'
import { DeleteUser } from "../_shared/types.ts";

/* Whether to mark the user as deleted instead of literally deleting it from the db entierly */
const markAsDeletedInstead = true

Deno.serve(async (req) => {
  const [success, response] = await new UserConnection(req, 'delete:user').connect()
  if (!success) return response
  const { adminClient, corsHeaders } = response

  const { email }: DeleteUser = await req.json()

  const { data, error: clientError } = await adminClient.auth.admin.listUsers()
  if (clientError) return new Response(clientError.message, { status: 400, headers: corsHeaders })

  const user = data.users.find(u => u.email === email)
  if (!user) return new Response('Not found', { status: 404, headers: corsHeaders })

  const { error } = await adminClient.auth.admin.deleteUser(user.id, markAsDeletedInstead)
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const [ok, result] = await response.registerToRealtime()
  if (!ok) return result

  return new Response("OK", { status: 200, headers: corsHeaders })
})