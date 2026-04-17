export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      trading_accounts: {
        Row: {
          id: string
          user_id: string
          account_number: string
          platform: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_number: string
          platform: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_number?: string
          platform?: string
          status?: string
          created_at?: string
        }
        Relationships: []
      }
      // Simplified for now, can be expanded later
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
