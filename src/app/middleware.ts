import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function getTenantFromHost(hostname: string): string | null {
  const parts = hostname.split('.')
  if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0]
  }
  return null
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const hostname = request.nextUrl.hostname
  const tenantSlug = getTenantFromHost(hostname)
  
  if (tenantSlug && !request.cookies.get('tenant_slug')) {
    response.cookies.set('tenant_slug', tenantSlug, { path: '/', httpOnly: true })
  }

  const path = request.nextUrl.pathname

  if (!user && (path.startsWith('/dashboard') || path.startsWith('/book'))) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  if (user && path.startsWith('/dashboard')) {
    const tenantId = tenantSlug 
      ? (await supabase.from('tenants').select('id').eq('slug', tenantSlug).single()).data?.id
      : null

    if (tenantSlug && !tenantId) {
      return NextResponse.redirect(new URL('/auth?error=tenant_not_found', request.url))
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const { data: membership } = await supabase
      .from('tenant_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .single()

    const role = profile?.role || 'user'
    const tenantRole = membership?.role || role

    if (path.includes('/admin') && tenantRole !== 'owner' && tenantRole !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/user', request.url))
    }
    if (path.includes('/user') && tenantRole === 'owner' && !path.includes('/admin')) {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    }
  }

  return response
}

export const config = {
  matcher: ['/dashboard/:path*', '/book/:path*'],
}
