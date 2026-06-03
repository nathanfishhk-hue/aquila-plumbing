export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { getRedisValue, setRedisValue, redis } from '@/lib/redis'
import { createServerClient } from '@supabase/ssr'
import { detectIntent, getAvailablePlumbers, calculateDynamicPricing, sendNotification, restructureCalendar } from '@/lib/ai-routing'
import { processPaymentWithPreference } from '@/lib/payment-router'

const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    return null
  }
  return new Groq({ apiKey: process.env.GROQ_API_KEY })
}

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

function getTenantSlug(request: NextRequest): string | null {
  const hostname = request.nextUrl.hostname
  const parts = hostname.split('.')
  if (parts.length > 1 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0]
  }
  const cookieSlug = request.cookies.get('tenant_slug')?.value
  return cookieSlug || null
}

export async function POST(request: NextRequest) {
  const groq = getGroqClient()
  const supabase = getSupabase(request)
  const tenantSlug = getTenantSlug(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  let tenantId: string | null = null
  if (tenantSlug) {
    const { data: tenant } = await supabase.from('tenants').select('id').eq('slug', tenantSlug).single()
    tenantId = tenant?.id || null
  }

  if (!groq) {
    return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
  }

  try {
    const { message, sessionId, history, context } = await request.json()

    if (!message || !sessionId) {
      return NextResponse.json({ error: 'Message and sessionId are required' }, { status: 400 })
    }

    const cacheKey = `ai:chat:${sessionId}`
    const cached = await getRedisValue<string | null>(cacheKey)
    if (cached) {
      return NextResponse.json({ reply: cached, cached: true })
    }

    const intent = detectIntent(message)
    let actionResult: any = null

    if (intent.intent === 'availability' && context?.serviceId && tenantId) {
      const date = context.date || new Date().toISOString().split('T')[0]
      actionResult = await getAvailablePlumbers(request, tenantId, date)
    }

    if (intent.intent === 'pricing' && context?.serviceId) {
      actionResult = await calculateDynamicPricing(
        context.serviceId,
        context.urgency as 'low' | 'medium' | 'high',
        context.location as string,
        context.bookingTime ? new Date(context.bookingTime) : undefined
      )
    }

    const systemPrompt = `You are Aquila Assistant, an AI-powered smart routing system for Aquila Plumbing.

You can help with:
- Checking employee availability and schedules
- Providing dynamic pricing based on urgency, location, and time
- Restructuring calendars for urgent call-outs
- Sending notifications to employees
- Handling multiple payment methods: Bitcoin, bank transfer, credit card

${actionResult ? `Current context: ${JSON.stringify(actionResult)}` : ''}

Respond concisely and helpfully. If the user wants to book or check availability, ask for their service type and preferred date/time.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(history) ? history : []),
      { role: 'user', content: message },
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 512,
      temperature: 0.7,
    })

    let reply = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response. Please try again.'

    if (intent.intent === 'availability' && actionResult) {
      if (actionResult.length === 0) {
        reply = "I couldn't find any available plumbers for that date. Would you like me to check a different day or add you to our waiting list?"
      } else {
        reply = `Available plumbers for ${context?.date}:\n` + 
          actionResult.map((a: any) => `- Available ${a.available_from} to ${a.available_to}`).join('\n') +
          `\n\nWould you like to book one of these slots?`
      }
    }

    if (intent.intent === 'pricing' && actionResult) {
      reply = `Pricing breakdown:\n**Base price:** $${actionResult.base_price}\n**Factors:**\n- ${actionResult.factors.urgency}\n- ${actionResult.factors.location}\n- ${actionResult.factors.time_based}\n\n**Total: $${actionResult.final_price}**`
    }

    await setRedisValue(cacheKey, reply, 3600)

    return NextResponse.json({ reply, cached: false, intent, actionResult })
  } catch (error: any) {
    console.error('AI chat error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process AI request' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const supabase = getSupabase(request)
  const tenantSlug = getTenantSlug(request)
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, ...payload } = await request.json()

  try {
    switch (action) {
      case 'send_notification': {
        const { plumberId, title, message, type, bookingId } = payload
        const notification = await sendNotification(request, plumberId, title, message, type, bookingId)
        return NextResponse.json({ success: true, notification })
      }

      case 'restructure_calendar': {
        const { tenantId, bookingId, newScheduledAt } = payload
        const updated = await restructureCalendar(request, tenantId, bookingId, newScheduledAt)
        return NextResponse.json({ success: true, booking: updated })
      }

      case 'process_payment': {
        const { profileId, amount, preference } = payload
        const result = await processPaymentWithPreference(profileId, amount, preference)
        return NextResponse.json({ success: true, payment: result })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
