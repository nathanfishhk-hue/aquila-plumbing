import { NextResponse } from 'next/server'
import { verifyPayfastITN } from '@/lib/payfast'
import { createServerClient } from '@supabase/ssr'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  const formData = await request.formData()
  const data: Record<string, string> = {}
  
  formData.forEach((value, key) => {
    data[key] = value.toString()
  })

  const isValid = await verifyPayfastITN(data)

  if (isValid && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )

    const bookingId = data.m_payment_id
    
    if (bookingId) {
      await supabase
        .from('bookings')
        .update({ 
          status: 'confirmed',
          payfast_payment_id: data.pf_payment_id 
        })
        .eq('id', bookingId)
    } else if (data.pf_payfast_token) {
      const tenantSlug = data.item_name?.replace(' Subscription', '')
      
      if (tenantSlug) {
        await supabase
          .from('tenants')
          .update({ 
            subscription_status: 'active',
            subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            payfast_token: data.pf_payfast_token
          })
          .eq('slug', tenantSlug)
      }
    }
  }

  return new NextResponse('OK')
}