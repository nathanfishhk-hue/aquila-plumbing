export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { createServerClient } from '@supabase/ssr'

function getSupabase(request: Request) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {},
      },
    }
  )
}

function getTenantIdFromHost(hostname: string): string | null {
  const parts = hostname.split('.')
  if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0]
  }
  return null
}

export async function GET(request: Request) {
  const supabase = getSupabase(request)
  const url = new URL(request.url)
  const hostname = request.headers.get('host') || 'localhost'
  const tenantSlug = getTenantIdFromHost(hostname)

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new Response(JSON.stringify([]), { 
      headers: { 'Content-Type': 'application/json' }
    })
  }

  let query = supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (tenantSlug) {
    const { data: tenant } = await supabase
      .from('tenants')
      .select('id')
      .eq('slug', tenantSlug)
      .single()
    
    if (tenant) {
      query = query.eq('tenant_id', tenant.id)
    }
  }

  const { data: services, error } = await query

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(services), { 
    headers: { 'Content-Type': 'application/json' }
  })
}