'use server'

import { z } from 'zod'

const payfastConfig = {
  merchantId: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID!,
  merchantKey: process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY!,
  sandbox: process.env.NEXT_PUBLIC_PAYFAST_SANDBOX === 'true',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
}

const payfastRequestSchema = z.object({
  paymentId: z.string(),
  amount: z.number(),
  itemName: z.string(),
  itemDescription: z.string(),
  email: z.string().email(),
  name: z.string(),
  cellNumber: z.string().optional(),
  returnUrl: z.string().url(),
  cancelUrl: z.string().url(),
  notifyUrl: z.string().url(),
})

export async function generatePayfastSignature(data: z.infer<typeof payfastRequestSchema>): Promise<string> {
  const payload = {
    ...data,
    merchant_id: payfastConfig.merchantId,
    merchant_key: payfastConfig.merchantKey,
  }

  const sortedKeys = Object.keys(payload).sort()
  const signatureString = sortedKeys
    .map(key => `${key}=${encodeURIComponent((payload as any)[key])}`)
    .join('&')
  
  return signatureString
}

export async function createPayfastPayment(paymentData: {
  bookingId: string
  amount: number
  serviceName: string
  userEmail: string
  userName: string
}): Promise<string> {
  const returnUrl = `${payfastConfig.siteUrl}/dashboard/user/bookings/${paymentData.bookingId}?status=success`
  const cancelUrl = `${payfastConfig.siteUrl}/dashboard/user/bookings/${paymentData.bookingId}?status=cancelled`
  const notifyUrl = `${payfastConfig.siteUrl}/api/payfast/notify`

  const signature = await generatePayfastSignature({
    paymentId: paymentData.bookingId,
    amount: paymentData.amount,
    itemName: paymentData.serviceName,
    itemDescription: `Plumbing service: ${paymentData.serviceName}`,
    email: paymentData.userEmail,
    name: paymentData.userName,
    returnUrl,
    cancelUrl,
    notifyUrl,
  })

  const baseUrl = payfastConfig.sandbox 
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process'

  const params = new URLSearchParams({
    merchant_id: payfastConfig.merchantId,
    merchant_key: payfastConfig.merchantKey,
    return_url: returnUrl,
    cancel_url: cancelUrl,
    notify_url: notifyUrl,
    amount: paymentData.amount.toString(),
    item_name: paymentData.serviceName,
    item_description: `Plumbing service: ${paymentData.serviceName}`,
    email_address: paymentData.userEmail,
    name_first: paymentData.userName.split(' ')[0],
    name_last: paymentData.userName.split(' ').slice(1).join(' ') || '',
    signature,
  })

  return `${baseUrl}?${params.toString()}`
}

export async function verifyPayfastITN(data: Record<string, string>): Promise<boolean> {
  const verifyData = {
    ...data,
    merchant_id: payfastConfig.merchantId,
    merchant_key: payfastConfig.merchantKey,
  }

  const verifyString = Object.keys(verifyData)
    .map(key => `${key}=${encodeURIComponent((verifyData as any)[key])}`)
    .join('&')
    .replace('signature=', 'signature=placeholder&')

  const verifyUrl = payfastConfig.sandbox
    ? 'https://sandbox.payfast.co.za/eng/query/validate'
    : 'https://www.payfast.co.za/eng/query/validate'

  try {
    const response = await fetch(verifyUrl, {
      method: 'POST',
      body: verifyString,
    })
    const result = await response.text()
    return result.includes('VALID')
  } catch (error) {
    console.error('Payfast ITN verification failed:', error)
    return false
  }
}