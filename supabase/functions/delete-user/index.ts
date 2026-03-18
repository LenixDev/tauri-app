import { UserConnection } from '../_shared/index.ts'
import { DeleteUser } from "../_shared/types.ts";

/* Whether to mark the user as deleted instead of literally deleting it from the db entierly */
const markAsDeletedInstead = true

Deno.serve(async (req) => {
  const connection = new UserConnection(req)
  const [success, response] = await connection.connect('delete:user')
  if (!success) return response
  const { client, corsHeaders, joinRealtimeEvents } = response

  const { identifier }: DeleteUser = await req.json()

  const { data, error: clientError } = await client
    .from('users')
    .select('id')
    .eq('identifier', identifier)
    .single<{ id: string }>()
  if (clientError) return new Response(clientError.message, { status: 400, headers: corsHeaders })

  const { error } = await client.auth.admin.deleteUser(data.id, markAsDeletedInstead)
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const [ok, result] = await joinRealtimeEvents()
  if (!ok) return result

  return new Response("OK", { status: 200, headers: corsHeaders })
})