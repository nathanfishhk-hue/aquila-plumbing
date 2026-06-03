import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { z } from 'zod'
import { createPayfastSubscription } from '@/lib/payfast'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const createTenantSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subscription_plan: z.enum(['free', 'pro', 'enterprise']),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subscription_plan } = createTenantSchema.parse(body)

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

    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const { data: tenant, error: tenantError } = await supabase
      .from('tenants')
      .insert({
        name,
        slug,
        email,
        subscription_plan,
        subscription_status: subscription_plan === 'free' ? 'active' : 'pending',
      })
      .select()
      .single()

    if (tenantError) {
      return NextResponse.json({ error: tenantError.message }, { status: 400 })
    }

    await supabase
      .from('tenant_members')
      .insert({ tenant_id: tenant.id, user_id: session.user.id, role: 'owner' })

    await supabase
      .from('profiles')
      .update({ tenant_id: tenant.id })
      .eq('id', session.user.id)

    if (subscription_plan !== 'free') {
      const subscriptionUrl = await createPayfastSubscription({
        tenantId: tenant.id,
        tenantName: name,
        plan: subscription_plan,
        email,
      })

      return NextResponse.json({ tenant, subscriptionUrl })
    }

    return NextResponse.json({ tenant })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to create tenant' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
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

  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')
  const tenantSlug = parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost'
    ? parts[0]
    : null

  if (!tenantSlug) {
    return NextResponse.json({ tenant: null })
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', tenantSlug)
    .single()

  if (error) {
    return NextResponse.json({ tenant: null })
  }

  return NextResponse.json({ tenant })
}
