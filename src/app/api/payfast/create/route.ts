import { NextResponse } from 'next/server'
import { createPayfastPayment } from '@/lib/payfast'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const { bookingId, amount, serviceName, userEmail, userName } = await request.json()

    const paymentUrl = await createPayfastPayment({
      bookingId,
      amount,
      serviceName,
      userEmail,
      userName,
    })

    return NextResponse.json({ paymentUrl })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create payment' }, { status: 500 })
  }
}