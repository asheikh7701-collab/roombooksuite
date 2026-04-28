import { createClient } from 'npm:@supabase/supabase-js@2.105.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

type CreateUserBody = {
  email: string
  password: string
  fullName: string
  department?: string
  jobTitle?: string
  role?: 'user' | 'admin'
  permissions?: {
    can_view_dashboard?: boolean
    can_book_rooms?: boolean
    can_view_reservations?: boolean
    can_manage_profile?: boolean
  }
}

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const anonKey = Deno.env.get('SUPABASE_PUBLISHABLE_KEY')
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !anonKey || !serviceKey) {
      return new Response(JSON.stringify({ error: 'Backend configuration is missing.' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const authHeader = req.headers.get('Authorization') ?? ''
    const authedClient = createClient(supabaseUrl, anonKey, { global: { headers: { Authorization: authHeader } } })
    const { data: callerData, error: callerError } = await authedClient.auth.getUser()
    if (callerError || !callerData.user) {
      return new Response(JSON.stringify({ error: 'You must be signed in.' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const { data: callerRoles } = await authedClient.from('user_roles').select('role').eq('user_id', callerData.user.id)
    if (!callerRoles?.some((role) => role.role === 'admin')) {
      return new Response(JSON.stringify({ error: 'Admin access is required.' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const body = await req.json() as CreateUserBody
    if (!body.email || !isEmail(body.email)) {
      return new Response(JSON.stringify({ error: 'A valid email is required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!body.password || body.password.length < 8) {
      return new Response(JSON.stringify({ error: 'Password must be at least 8 characters.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    if (!body.fullName?.trim()) {
      return new Response(JSON.stringify({ error: 'Full name is required.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const adminClient = createClient(supabaseUrl, serviceKey)
    const email = body.email.trim().toLowerCase()
    const fullName = body.fullName.trim()

    const { data: created, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: body.password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    })

    if (createError || !created.user) {
      return new Response(JSON.stringify({ error: createError?.message ?? 'Could not create user.' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    const userId = created.user.id
    const role = body.role === 'admin' ? 'admin' : 'user'

    const { error: profileError } = await adminClient.from('profiles').upsert({
      user_id: userId,
      email,
      full_name: fullName,
      department: body.department?.trim() || 'General',
      job_title: body.jobTitle?.trim() || null,
      status: 'active',
    }, { onConflict: 'user_id' })
    if (profileError) throw profileError

    const { error: roleError } = await adminClient.from('user_roles').upsert({ user_id: userId, role }, { onConflict: 'user_id,role' })
    if (roleError) throw roleError

    const permissions = body.permissions ?? {}
    const { error: permissionsError } = await adminClient.from('user_permissions').upsert({
      user_id: userId,
      can_view_dashboard: permissions.can_view_dashboard ?? true,
      can_book_rooms: permissions.can_book_rooms ?? true,
      can_view_reservations: permissions.can_view_reservations ?? true,
      can_manage_profile: permissions.can_manage_profile ?? true,
    }, { onConflict: 'user_id' })
    if (permissionsError) throw permissionsError

    return new Response(JSON.stringify({ success: true, userId }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})
