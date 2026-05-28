import { NextRequest, NextResponse } from 'next/server'
import { createPayfastPayment } from '@/lib/payfast'

export async function POST(request: NextRequest) {
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