import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {}
      },
    }
  )

  const { data: services, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(services)
}