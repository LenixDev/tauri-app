// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import { Permission, Role } from './types.ts';

type SharedInitResult = 
  | [false, Response]
  | [true, { 
      adminClient: SupabaseClient
      corsHeaders: typeof corsHeaders 
    }]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const createSupabaseClient = (req: Request) =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

const getUser = async (supabaseClient: SupabaseClient) => {
  const { data: { user } } = await supabaseClient.auth.getUser()
  return user
}

const getProfile = async (supabaseClient: SupabaseClient, id: string) => {
  const { data: profile } = await supabaseClient
    .from('users')
    .select('role')
    .eq('id', id)
    .single<{ role: Role }>()
  return profile
}

const createAdminClient = () =>
  createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

export const sharedInit = async (req: Request, permission: Permission): Promise<SharedInitResult> => {
  if (req.method === 'OPTIONS') return [false, new Response(null, { headers: corsHeaders })]

  const supabaseClient = createSupabaseClient(req)

  const user = await getUser(supabaseClient)
  if (!user) return [false, new Response('Unauthorized', { status: 401, headers: corsHeaders })]

  const profile = await getProfile(supabaseClient, user.id)

  const isRolePermissed = async (role: Readonly<Role | undefined>, permission: Readonly<Permission>) => {
    if (!role) return false

    const { data: rolePermissions } = await supabaseClient
      .from('role_permissions')
      .select('permissions')
      .eq('role', role)
      .single<{ permissions: Permission[] }>()
    return rolePermissions?.permissions.includes(permission) ?? false
  }

  if (!await isRolePermissed(profile?.role, permission)) return [false, new Response('Forbidden', { status: 403, headers: corsHeaders })]

  const adminClient = createAdminClient()

  return [true, { adminClient, corsHeaders }]
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/