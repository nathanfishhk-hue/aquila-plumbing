'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/database.types'

type Tenant = Database['public']['Tables']['tenants']['Row']

interface TenantContextValue {
  tenant: Tenant | null
  loading: boolean
  refreshTenant: () => Promise<void>
}

const TenantContext = createContext<TenantContextValue>({
  tenant: null,
  loading: true,
  refreshTenant: async () => {},
})

export function useTenant() {
  return useContext(TenantContext)
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const supabase = createClient()
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [loading, setLoading] = useState(true)

  const getTenantSlugFromHost = useCallback(() => {
    if (typeof window === 'undefined') return null
    const parts = window.location.hostname.split('.')
    if (parts.length > 1 && parts[0] !== 'www') {
      return parts[0]
    }
    return null
  }, [])

  const refreshTenant = useCallback(async () => {
    setLoading(true)
    try {
      const tenantSlug = getTenantSlugFromHost()
      if (!tenantSlug) {
        setTenant(null)
        return
      }

      const { data } = await supabase
        .from('tenants')
        .select('*')
        .eq('slug', tenantSlug)
        .single()

      setTenant(data)
    } catch {
      setTenant(null)
    } finally {
      setLoading(false)
    }
  }, [supabase, getTenantSlugFromHost])

  useEffect(() => {
    refreshTenant()
  }, [refreshTenant])

  return (
    <TenantContext.Provider value={{ tenant, loading, refreshTenant }}>
      {children}
    </TenantContext.Provider>
  )
}