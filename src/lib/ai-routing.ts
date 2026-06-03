import { redis } from '@/lib/redis'
import { createServerClient } from '@supabase/ssr'

export type Intent = 'availability' | 'pricing' | 'scheduling' | 'notification' | 'payment' | 'general'

interface IntentDetection {
  intent: Intent
  confidence: number
  entities: Record<string, unknown>
}

interface AvailabilitySlot {
  plumber_id: string
  full_name: string
  available_from: string
  available_to: string
  day_of_week: number
}

interface DynamicPricing {
  base_price: number
  urgency_multiplier: number
  location_multiplier: number
  final_price: number
  factors: {
    urgency: string
    location: string
    time_based: string
  }
}

export function detectIntent(message: string): IntentDetection {
  const lower = message.toLowerCase()
  
  const urgencyKeywords = ['urgent', 'emergency', 'asap', 'immediately', 'now', 'today', 'rush']
  const pricingKeywords = ['price', 'cost', 'expensive', 'cheap', 'how much', 'rate', 'charge']
  const scheduleKeywords = ['schedule', 'calendar', 'book', 'appointment', 'when', 'available', 'availability']
  const notificationKeywords = ['notify', 'alert', 'message', 'email', 'sms', 'call']
  const paymentKeywords = ['pay', 'bitcoin', 'card', 'bank transfer', 'payment', 'wallet', 'crypto']
  
  let urgencyScore = urgencyKeywords.filter(k => lower.includes(k)).length
  let pricingScore = pricingKeywords.filter(k => lower.includes(k)).length
  let scheduleScore = scheduleKeywords.filter(k => lower.includes(k)).length
  let notificationScore = notificationKeywords.filter(k => lower.includes(k)).length
  let paymentScore = paymentKeywords.filter(k => lower.includes(k)).length
  
  const scores = { urgencyScore, pricingScore, scheduleScore, notificationScore, paymentScore }
  const maxScore = Math.max(...Object.values(scores))
  
  if (maxScore === 0) {
    return { intent: 'general', confidence: 0.5, entities: {} }
  }
  
  const detected = Object.entries(scores).find(([, score]) => score === maxScore)?.[0] as Intent
  
  const entities: Record<string, unknown> = {}
  
  if (detected === 'availability' || detected === 'scheduling') {
    const timeMatch = lower.match(/(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i)
    if (timeMatch) entities.time = timeMatch[0]
    
    const dayMatch = lower.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)
    if (dayMatch) entities.day = dayMatch[1]
  }
  
  if (detected === 'pricing') {
    if (urgencyKeywords.some(k => lower.includes(k))) {
      entities.urgency = 'high'
    }
    if (lower.includes('bitcoin') || lower.includes('crypto')) {
      entities.payment_preference = 'bitcoin'
    }
  }
  
  // Improved confidence calculation
  const totalKeywords = urgencyKeywords.length + pricingKeywords.length + scheduleKeywords.length + notificationKeywords.length + paymentKeywords.length
  const confidence = Math.min(0.95, 0.5 + (maxScore / totalKeywords))
  
  return { intent: detected, confidence, entities }
}

export async function getAvailablePlumbers(
  request: Request,
  tenantId: string | null,
  date: string
): Promise<AvailabilitySlot[]> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const dayOfWeek = new Date(date).getDay()

  // First get availability records
  let availabilityQuery = supabase
    .from('availability')
    .select(`
      plumber_id,
      start_time,
      end_time,
      day_of_week
    `)
    .eq('day_of_week', dayOfWeek)

  // Filter by tenant if provided
  if (tenantId) {
    const { data: tenantPlumbers } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('tenant_id', tenantId)
      .eq('role', 'plumber')

    if (tenantPlumbers && tenantPlumbers.length > 0) {
      const plumberIds = tenantPlumbers.map(p => p.id)
      availabilityQuery = availabilityQuery.in('plumber_id', plumberIds)
    }
  }

  const { data: availability } = await availabilityQuery

  // Get plumber names for the availability records
  const plumberIds = [...new Set((availability || []).map(a => a.plumber_id))]
  const plumberNames: Record<string, string> = {}

  if (plumberIds.length > 0) {
    const { data: plumbers } = await supabase
      .from('profiles')
      .select('id, full_name')
      .in('id', plumberIds)

    if (plumbers) {
      plumbers.forEach(plumber => {
        plumberNames[plumber.id] = plumber.full_name || ''
      })
    }
  }

  const cacheKey = `availability:${tenantId}:${date}`
  const cached = await getRedisValue<AvailabilitySlot[]>(cacheKey)
  if (cached) return cached

  const result = availability?.map(a => ({
    plumber_id: a.plumber_id,
    full_name: plumberNames[a.plumber_id] || '',
    available_from: a.start_time,
    available_to: a.end_time,
    day_of_week: a.day_of_week
  })) || []

  await setRedisValue(cacheKey, JSON.stringify(result), 300)
  return result
}

export async function calculateDynamicPricing(
  serviceId: string,
  urgency: 'low' | 'medium' | 'high' = 'low',
  location: string = 'standard',
  bookingTime?: Date
): Promise<DynamicPricing> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data: service } = await supabase
    .from('services')
    .select('base_price, duration_minutes')
    .eq('id', serviceId)
    .single()

  const basePrice = service?.base_price || 100

  let urgencyMultiplier = 1
  if (urgency === 'high') urgencyMultiplier = 1.5
  else if (urgency === 'medium') urgencyMultiplier = 1.25

  let locationMultiplier = 1
  if (location === 'remote' || location === 'far') locationMultiplier = 1.2
  else if (location === 'urban') locationMultiplier = 1.1

  let timeBasedMultiplier = 1
  if (bookingTime) {
    const hour = bookingTime.getHours()
    if (hour >= 18 || hour <= 6) timeBasedMultiplier = 1.3
    if (hour >= 22 || hour <= 4) timeBasedMultiplier = 1.5
  }

  const factors = {
    urgency: urgency === 'high' ? 'High urgency (+50%)' : urgency === 'medium' ? 'Medium urgency (+25%)' : 'Standard',
    location: location !== 'standard' ? `Location: ${location}` : 'Standard location',
    time_based: timeBasedMultiplier > 1 ? `After-hours (+${Math.round((timeBasedMultiplier - 1) * 100)}%)` : 'Standard hours'
  }

  return {
    base_price: basePrice,
    urgency_multiplier: urgencyMultiplier,
    location_multiplier: locationMultiplier,
    final_price: Math.round(basePrice * urgencyMultiplier * locationMultiplier * timeBasedMultiplier),
    factors
  }
}

export async function sendNotification(
  request: Request,
  plumberId: string,
  title: string,
  message: string,
  type: 'urgent' | 'schedule' | 'payment' | 'general' = 'general',
  bookingId?: string
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data: notification } = await supabase
    .from('notifications')
    .insert({
      plumber_id: plumberId,
      title,
      message,
      type,
      booking_id: bookingId,
      read: false,
      sent_at: new Date().toISOString()
    })
    .select()
    .single()

  try {
    await redis.publish(`notifications:${plumberId}`, JSON.stringify({
      title,
      message,
      type,
      timestamp: new Date().toISOString()
    }))
  } catch (e) {
    console.error('Failed to publish notification', e)
  }

  return notification
}

export async function restructureCalendar(
  request: Request,
  tenantId: string,
  urgentBookingId: string,
  newScheduledAt: string
) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  )

  const { data: urgentBooking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', urgentBookingId)
    .single()

  if (!urgentBooking) throw new Error('Booking not found')

  const { data: overlappingBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('plumber_id', urgentBooking.plumber_id)
    .in('status', ['pending', 'confirmed'])

  const urgentTime = new Date(newScheduledAt)

  // Sort overlapping bookings by time to handle rescheduling properly
  const sortedBookings = (overlappingBookings || []).sort((a, b) => 
    new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime()
  )

  for (const booking of sortedBookings) {
    const existingTime = new Date(booking.scheduled_at)
    const timeDiff = Math.abs(existingTime.getTime() - urgentTime.getTime())
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    if (hoursDiff < 2) {
      // Move to next available slot (3 hours later)
      const newTime = new Date(existingTime.getTime() + (3 * 60 * 60 * 1000))
      await supabase
        .from('bookings')
        .update({ scheduled_at: newTime.toISOString() })
        .eq('id', booking.id)
    }
  }

  const { data: updated } = await supabase
    .from('bookings')
    .update({ scheduled_at: newScheduledAt })
    .eq('id', urgentBookingId)
    .select()
    .single()

  return updated
}

async function getRedisValue<T>(key: string): Promise<T | null> {
  try {
    return await redis.get(key)
  } catch {
    return null
  }
}

async function setRedisValue(key: string, value: string, ex?: number): Promise<void> {
  try {
    if (ex) await redis.setex(key, ex, value)
    else await redis.set(key, value)
  } catch {}
}