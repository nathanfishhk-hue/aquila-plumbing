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
    const bookingId = data.m_payment_id
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    
    await supabase
      .from('bookings')
      .update({ 
        status: 'confirmed',
        payfast_payment_id: data.pf_payment_id 
      })
      .eq('id', bookingId)
  }

  return new NextResponse('OK')
}