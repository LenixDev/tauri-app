// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient, SupabaseClient } from 'jsr:@supabase/supabase-js@2'
import type { Events, Permission, Role, RealtimeRegisteration } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://localhost:1420',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export class UserConnection {
  private readonly req: Request
  private readonly permission: Permission
  private readonly supabaseClient: SupabaseClient
  private readonly admin: SupabaseClient
  
  constructor(req: Request, permission: Permission) {
    this.req = req
    this.permission = permission
    this.supabaseClient = this.createSupabaseClient()
    this.admin = this.createAdminClient()
  }

  private createSupabaseClient() {
    return createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: this.req.headers.get('Authorization')! } } }
    )
  }

  private async getUser() {
    const { data: { user } } = await this.supabaseClient.auth.getUser()
    return user
  }

  private async getProfile(supabaseClient: SupabaseClient, id: string) {
    const { data: profile } = await supabaseClient
      .from('users')
      .select('role')
      .eq('id', id)
      .single<{ role: Role }>()
    return profile
  }

  private createAdminClient() {
    return createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )
  }

  private async isRolePermissed(id: string) {
    const profile = await this.getProfile(this.supabaseClient, id)
    if (!profile?.role) return false

    const { data: rolePermissions } = await this.supabaseClient
      .from('role_permissions')
      .select('permissions')
      .eq('role', profile?.role)
      .single<{ permissions: Permission[] }>()

    return rolePermissions?.permissions.includes(this.permission) ?? false
  }

  /** 
   * Register the admin to the database's changes
   * @return
  */
  private realtimeSubscription: RealtimeRegisteration = async () => {
    const result = await this.admin.channel("db-changes").send({
      type: "broadcast",
      event: "users-management" satisfies Events,
      payload: {},
    })
    if (result !== 'ok') return [false, new Response(result, { status: 500, headers: corsHeaders })]
    return [true]
  }

  /**
    Connect the user to the database __PERMISSEVELY__
    @return Admin's functions and the HTTP's headers
  */
  public async connect(): Promise<
    [false, Response]
    | [true, {
      adminClient: SupabaseClient
      corsHeaders: typeof corsHeaders
      registerToRealtime: RealtimeRegisteration
    }]
  > {
    if (this.req.method === 'OPTIONS') {
      return [false, new Response("Wrong Method", { headers: corsHeaders })]
    }

    const user = await this.getUser()
    if (!user) {
      return [false, new Response('Unauthorized', { status: 401, headers: corsHeaders })]
    }

    if (!await this.isRolePermissed(user.id)) {
      return [false, new Response('Forbidden', { status: 403, headers: corsHeaders })]
    }

    return [true, {
      adminClient: this.admin,
      corsHeaders,
      registerToRealtime: this.realtimeSubscription
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