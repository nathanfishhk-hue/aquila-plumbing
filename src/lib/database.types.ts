export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          address: string | null
          role: 'user' | 'admin' | 'plumber'
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name?: string | null
          phone?: string | null
          address?: string | null
          role?: 'user' | 'admin' | 'plumber'
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
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
          name: string
          description: string | null
          base_price: number
          duration_minutes: number
          icon_name: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          base_price: number
          duration_minutes: number
          icon_name?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
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
          plumber_id: string
          day_of_week: number
          start_time: string
          end_time: string
        }
        Insert: {
          id?: string
          plumber_id: string
          day_of_week: number
          start_time: string
          end_time: string
        }
        Update: {
          id?: string
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
    }
  }
}