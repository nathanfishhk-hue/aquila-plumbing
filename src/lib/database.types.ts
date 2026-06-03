export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          tenant_id: string | null
          full_name: string | null
          phone: string | null
          address: string | null
          role: 'user' | 'admin' | 'plumber'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin' | 'plumber'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin' | 'plumber'
          avatar_url?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          tenant_id: string | null
          name: string
          description: string | null
          base_price: number
          duration_minutes: number
          icon_name: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          name: string
          description?: string | null
          base_price: number
          duration_minutes: number
          icon_name?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          tenant_id?: string | null
          name?: string
          description?: string | null
          base_price?: number
          duration_minutes?: number
          icon_name?: string | null
          is_active?: boolean
        }
      }
      bookings: {
        Row: {
          id: string
          tenant_id: string | null
          user_id: string
          service_id: string
          plumber_id: string | null
          scheduled_at: string
          status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          amount: number
          payfast_payment_id: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          user_id: string
          service_id: string
          plumber_id?: string | null
          scheduled_at: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          amount: number
          payfast_payment_id?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          user_id?: string
          service_id?: string
          plumber_id?: string | null
          scheduled_at?: string
          status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
          amount?: number
          payfast_payment_id?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      availability: {
        Row: {
          id: string
          tenant_id: string | null
          plumber_id: string
          day_of_week: number
          start_time: string
          end_time: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          plumber_id: string
          day_of_week: number
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          plumber_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          rating: number
          comment: string | null
        }
        Insert: {
          id?: string
          booking_id: string
          rating: number
          comment?: string | null
        }
        Update: {
          id?: string
          booking_id?: string
          rating?: number
          comment?: string | null
        }
      }
      tenants: {
        Row: {
          id: string
          name: string
          slug: string
          email: string | null
          phone: string | null
          address: string | null
          logo_url: string | null
          subscription_plan: 'free' | 'pro' | 'enterprise'
          subscription_status: 'active' | 'cancelled' | 'past_due'
          subscription_expires_at: string | null
          payfast_token: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          email?: string | null
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          subscription_plan?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          subscription_expires_at?: string | null
          payfast_token?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          logo_url?: string | null
          subscription_plan?: 'free' | 'pro' | 'enterprise'
          subscription_status?: 'active' | 'cancelled' | 'past_due'
          subscription_expires_at?: string | null
          payfast_token?: string | null
          created_at?: string
        }
      }
      tenant_members: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          role: 'owner' | 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          role?: 'owner' | 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
          role?: 'owner' | 'admin' | 'user'
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          tenant_id: string | null
          plumber_id: string
          booking_id: string | null
          title: string
          message: string
          type: 'urgent' | 'schedule' | 'payment' | 'general'
          read: boolean
          sent_at: string
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id?: string | null
          plumber_id: string
          booking_id?: string | null
          title: string
          message: string
          type?: 'urgent' | 'schedule' | 'payment' | 'general'
          read?: boolean
          sent_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string | null
          plumber_id?: string
          booking_id?: string | null
          title?: string
          message?: string
          type?: 'urgent' | 'schedule' | 'payment' | 'general'
          read?: boolean
          sent_at?: string
          created_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          profile_id: string
          type: 'credit_card' | 'bank_transfer' | 'bitcoin'
          provider: string | null
          details: Record<string, unknown> | null
          is_default: boolean
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          type: 'credit_card' | 'bank_transfer' | 'bitcoin'
          provider?: string | null
          details?: Record<string, unknown> | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          type?: 'credit_card' | 'bank_transfer' | 'bitcoin'
          provider?: string | null
          details?: Record<string, unknown> | null
          is_default?: boolean
          is_active?: boolean
          created_at?: string
        }
      }
    }
  }
}