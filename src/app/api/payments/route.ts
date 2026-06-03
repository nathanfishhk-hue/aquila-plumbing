export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

function getSupabase(request: NextRequest) {
  let response = NextResponse.next()
  return createServerClient(
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
}

export async function GET(request: NextRequest) {
  const supabase = getSupabase(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: paymentMethods, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('profile_id', session.user.id)
    .eq('is_active', true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ paymentMethods })
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { type, details, set_default } = await request.json()

  if (!type || !['credit_card', 'bank_transfer', 'bitcoin'].includes(type)) {
    return NextResponse.json({ error: 'Invalid payment method type' }, { status: 400 })
  }

  const { data: paymentMethod, error } = await supabase
    .from('payment_methods')
    .insert({
      profile_id: session.user.id,
      type,
      details,
      is_default: set_default || false,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (set_default) {
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('profile_id', session.user.id)
      .neq('id', paymentMethod.id)
  }

  return NextResponse.json({ paymentMethod })
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabase(request)
  const { searchParams } = new URL(request.url)
  const methodId = searchParams.get('id')

  if (!methodId) {
    return NextResponse.json({ error: 'Method ID required' }, { status: 400 })
  }

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', methodId)
    .eq('profile_id', session.user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}