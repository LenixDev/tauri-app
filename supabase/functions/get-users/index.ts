import { corsHeaders as Headers, createSupabaseClient, getUser, getProfile, createAdminClient } from '../_shared'

const corsHeaders = Headers

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response(null, { headers: corsHeaders })

  const supabaseClient = createSupabaseClient(req)

  const user = await getUser(supabaseClient)
  if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const profile = await getProfile(supabaseClient, user.id)
  const adminClient = createAdminClient()
  
  const isPermitted = async (role: string, permission: string) => {
    const { data } = await supabaseClient
      .from('role_permissions')
      .select('permissions')
      .eq('role', role)
      .single()
    return data?.permissions.includes(permission) ?? false
  }

  if (!await isPermitted(profile?.role, 'users:read'))
    return new Response('Forbidden', { status: 403, headers: corsHeaders })


  const { data: { users }, error } = await adminClient.auth.admin.listUsers()
  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  return new Response(JSON.stringify(users), { status: 200, headers: corsHeaders })
})
