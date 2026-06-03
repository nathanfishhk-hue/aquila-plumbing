import { z } from 'zod'
import { createServerClient } from '@supabase/ssr'

const paymentMethodSchema = z.object({
  type: z.enum(['credit_card', 'bank_transfer', 'bitcoin']),
  provider: z.string().optional(),
  details: z.record(z.unknown()).optional(),
})

const paymentPreferenceSchema = z.object({
  method: z.enum(['credit_card', 'bank_transfer', 'bitcoin']),
  save_for_future: z.boolean().optional(),
})

function getSupabaseClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
}

export async function processPaymentWithPreference(
  profileId: string,
  amount: number,
  preference: z.infer<typeof paymentPreferenceSchema>
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )
  
  // Validate amount
  if (amount <= 0) {
    throw new Error('Payment amount must be greater than zero')
  }
  
  const { data: paymentMethod } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('profile_id', profileId)
    .eq('type', preference.method)
    .eq('is_active', true)
    .single()
  
  // If no payment method found for this type, return error instead of falling back to credit card
  if (!paymentMethod) {
    throw new Error(`No active ${preference.method} payment method found for this profile`)
  }
  
  switch (preference.method) {
    case 'bitcoin':
      return processBitcoinPayment(profileId, amount, paymentMethod)
    case 'bank_transfer':
      return processBankTransfer(profileId, amount, paymentMethod)
    case 'credit_card':
      return processCreditCardPayment(profileId, amount, paymentMethod)
    default:
      throw new Error(`Unsupported payment method: ${preference.method}`)
  }
}

async function processBitcoinPayment(profileId: string, amount: number, paymentMethod: any) {
  const provider = process.env.BITCOIN_PAYMENT_PROVIDER || 'coinbase'
  
  // In a real implementation, this would call a Bitcoin payment API
  // For now, we'll simulate a more realistic response
  const walletAddress = paymentMethod.details?.wallet_address || 
    `${provider.toUpperCase()}_WALLET_${Math.random().toString(36).substring(2, 15)}`
  
  return {
    payment_type: 'bitcoin',
    amount,
    walletAddress,
    qr_code: `bitcoin:${walletAddress}?amount=${amount}`,
    confirmation_url: `https://blockchain.info/address/${walletAddress}`,
    status: 'pending',
    provider,
    transaction_id: `btc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes to pay
    details: {
      network: 'bitcoin',
      confirmations_required: 3,
      ...paymentMethod.details
    }
  }
}

async function processBankTransfer(profileId: string, amount: number, paymentMethod: any) {
  const bankDetails = {
    account_name: paymentMethod.details?.account_name || process.env.BANK_ACCOUNT_NAME || 'Aquila Plumbing',
    account_number: paymentMethod.details?.account_number || process.env.BANK_ACCOUNT_NUMBER || 'PLACEHOLDER',
    routing_number: paymentMethod.details?.routing_number || process.env.BANK_ROUTING_NUMBER || 'PLACEHOLDER',
    bank_name: paymentMethod.details?.bank_name || process.env.BANK_NAME || 'Placeholder Bank',
    swift_code: paymentMethod.details?.swift_code || process.env.BANK_SWIFT_CODE || 'PLACEHOLDER',
    reference: `AQ${Date.now()}${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  }
  
  return {
    payment_type: 'bank_transfer',
    amount,
    bankDetails,
    status: 'pending',
    provider: 'bank_transfer',
    transaction_id: `bt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours to pay
    details: {
      ...bankDetails
    }
  }
}

async function processCreditCardPayment(profileId: string, amount: number, paymentMethod: any) {
  try {
    // Get user profile to get name and email for Payfast
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => [], setAll: () => {} } }
    )
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', profileId)
      .single()
    
    // Generate a temporary booking ID for this payment
    const tempBookingId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    
    // Import and use the actual Payfast function
    const { createPayfastPayment } = await import('@/lib/payfast')
    
    // Create Payfast payment URL
    const paymentUrl = await createPayfastPayment({
      bookingId: tempBookingId,
      amount,
      serviceName: 'Plumbing Service',
      userEmail: profile?.email || 'customer@example.com',
      userName: profile?.full_name || 'Customer'
    })
    
    return {
      payment_type: 'credit_card',
      amount,
      provider: 'payfast',
      status: 'redirect_required',
      transaction_id: tempBookingId,
      redirect_url: paymentUrl,
      details: {
        ...paymentMethod.details,
        bookingId: tempBookingId
      }
    }
  } catch (error) {
    // Fallback if there's an issue
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return {
      payment_type: 'credit_card',
      amount,
      provider: 'payfast',
      status: 'redirect_required',
      transaction_id: `pf_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      redirect_url: '/payment/pending?error=true',
      details: {
        ...paymentMethod.details,
        error: errorMessage
      }
    }
  }
}