// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
console.log("Hello from Functions!")

import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS')
    return new Response(null, { headers: corsHeaders })
  
  const authHeader = req.headers.get('Authorization')
  console.log('auth header:', authHeader)

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { data: { user } } = await supabaseClient.auth.getUser()
  if (!user)
    return new Response('Unauthorized', { status: 401, headers: corsHeaders })

  const { data: profile } = await supabaseClient
    .from('profiles')
    .select('role')
    .single()

  if (profile?.role !== 'manager')
    return new Response('Forbidden', { status: 403, headers: corsHeaders })

  const adminClient = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { identifier, role, password } = await req.json()

  const { data, error } = await adminClient.auth.admin.createUser({
    email: `${identifier}@institute.local`,
    password,
    email_confirm: true,
  })

  if (error)
    return new Response(error.message, { status: 400, headers: corsHeaders })

  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({ id: data.user.id, role })

  if (profileError)
    return new Response(profileError.message, { status: 400, headers: corsHeaders })

  return new Response('OK', { status: 200, headers: corsHeaders })
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-student' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
