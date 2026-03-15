// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { Permission, Role } from '../_shared/types'
import { corsHeaders as Headers, createAdminClient, createSupabaseClient, getProfile, getUser } from '../_shared'

const corsHeaders = Headers

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response(null, { headers: corsHeaders })
  
  const supabaseClient = createSupabaseClient(req)

  const user = await getUser(supabaseClient)
  if (!user) return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const profile = await getProfile(supabaseClient, user.id)
  const adminClient = createAdminClient()

  const isUserRolePermissed = async (role: Readonly<Role | undefined>, permission: Readonly<Permission>) => {
    if (!role) return false

    const { data: rolePermissions } = await supabaseClient
      .from('role_permissions')
      .select('permissions')
      .eq('role', role)
      .single<{ permissions: Permission[] }>()
    return rolePermissions?.permissions.includes(permission)
  }

  if (!await isUserRolePermissed(profile?.role, 'create:user')) return new Response('Forbidden', { status: 403, headers: corsHeaders })

  const { identifier, role, password }: {
    identifier: string, role: Role, password: string
  } = await req.json()

  const { data, error } = await adminClient.auth.admin.createUser({
    email: `${identifier}@institute.local`,
    password,
    email_confirm: true,
  })

  if (error) return new Response(error.message, { status: 400, headers: corsHeaders })

  const { error: profileError } = await adminClient
    .from('users')
    .insert({ id: data.user.id, role })

  if (profileError) return new Response(profileError.message, { status: 400, headers: corsHeaders })

  return new Response('OK', { status: 200, headers: corsHeaders })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
