import { NextRequest, NextResponse } from 'next/server'
import { verifyPayfastITN } from '@/lib/payfast'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const data: Record<string, string> = {}
  
  formData.forEach((value, key) => {
    data[key] = value.toString()
  })

  const isValid = await verifyPayfastITN(data)

  if (isValid) {
    const bookingId = data.m_payment_id
    
    // Update booking status
    const supabase = createClient()
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

function createClient() {
  const { createServerClient } = require('@supabase/ssr')
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  ).supabase
}