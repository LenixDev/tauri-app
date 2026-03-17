// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Events, Permission, Role, RealtimeRegisteration } from './types.ts';

export class UserConnection {
  private readonly corsHeaders = {
    'Access-Control-Allow-Origin': 'http://localhost:1420',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  constructor() {}

  /**
    Connect the user to the database __PERMISSEVELY__
    @return Admin's functions and the HTTP's headers
  */
  public async connect(req: Request, permission: Permission): Promise<
    [false, Response]
    | [true, {
      admin: SupabaseClient
      corsHeaders: typeof UserConnection.prototype.corsHeaders
      joinRealtimeEvents: () => Promise<RealtimeRegisteration>
    }]
  > {
    if (req.method === 'OPTIONS') return [false, new Response(null, { status: 405, headers: this.corsHeaders })]

    const Authorization = req.headers.get('Authorization')
    if (!Authorization) throw new Error('Authorization is not defined')

    const url = Deno.env.get("SUPABASE_URL")
    const key = Deno.env.get("SUPABASE_ANON_KEY")
    if (!url || !key) return [false, new Response(null, { status: 400, headers: this.corsHeaders })]

    const admin = createClient(url, key, {
      global: { headers: { Authorization } }
    })

    const { data: { user } } = await admin.auth.getUser()
    if (!user) return [false, new Response(null, { status: 400, headers: this.corsHeaders })]

    const { data: profile, error } = await admin
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single<{ role: Role }>()
    if (error) return [false, new Response(error.message, { status: 400, headers: this.corsHeaders })]

    const { data: rolePermissions } = await admin
      .from('role_permissions')
      .select('permissions')
      .eq('role', profile?.role)
      .single<{ permissions: Permission[] }>()

    const isPermissed = rolePermissions?.permissions.includes(permission) ?? false
    if (!isPermissed) return [false, new Response(null, { status: 403, headers: this.corsHeaders })]

    /**
     * Register the admin to the database's changes
     * @return
    */
    const joinRealtimeEvents = async (): Promise<RealtimeRegisteration> => {
      const result = await admin.channel("db-changes").send({
        type: "broadcast",
        event: "users-management" satisfies Events,
        payload: {},
      })
      if (result !== 'ok') return [false, new Response(result, { status: 500, headers: this.corsHeaders })]
      return [true]
    }
    return [true, {
      admin,
      corsHeaders: this.corsHeaders,
      joinRealtimeEvents 
    }]
  }
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/get-users' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/