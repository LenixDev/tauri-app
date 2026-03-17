// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import { createClient, SupabaseClient, User } from 'jsr:@supabase/supabase-js@2'
import type { Events, Permission, Role, RealtimeRegisteration } from './types.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:1420',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

class Server {
  protected accessor url: string
  protected accessor key: string
  protected constructor() {
    this.url = this.initUrl()
    this.key = this.initKey()
  }

  private initUrl() {
    const url = Deno.env.get('SUPABASE_URL')
    if (!url) throw new Error('SUPABASE_URL is not defined')
    return url
  }
  private initKey() {
    const key = Deno.env.get('SUPABASE_ANON_KEY')
    if (!key) throw new Error('SUPABASE_ANON_KEY is not defined')
    return key
  }
}

export class UserConnection extends Server {
  private readonly req: Request
  private readonly permission: Permission
  private readonly supabaseClient: SupabaseClient
  private readonly admin: SupabaseClient

  constructor(req: Request, permission: Permission) {
    super()
    this.req = req
    this.permission = permission
    this.supabaseClient = this.createSupabaseClient()
    this.admin = createClient(this.url, this.key)
  }

  private createSupabaseClient() {
    const Authorization = this.req.headers.get('Authorization')
    if (!Authorization) throw new Error('Authorization header is not defined')

    return createClient(this.url, this.key, {
      global: { headers: { Authorization } }
    })
  }

  private async isSafeConnection(): Promise<[true] | [false, Response]> {
    if (this.req.method === 'OPTIONS') return [false, new Response("Wrong Method", { status: 405, headers: corsHeaders })]

    const { data: { user } } = await this.supabaseClient.auth.getUser()
    if (!user) return [false, new Response("Bad request", { status: 400, headers: corsHeaders })]

    const { data: profile, error } = await this.supabaseClient
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single<{ role: Role }>()
    if (error) return [false, new Response(error.message, { status: 400, headers: corsHeaders })]

    const { data: rolePermissions } = await this.supabaseClient
      .from('role_permissions')
      .select('permissions')
      .eq('role', profile?.role)
      .single<{ permissions: Permission[] }>()

    const isPermissed = rolePermissions?.permissions.includes(this.permission) ?? false
    if (!isPermissed) return [false, new Response('Forbidden', { status: 403, headers: corsHeaders })]
    return [true]
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
    const [success, response] = await this.isSafeConnection()
    if (!success) return [false, response]

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