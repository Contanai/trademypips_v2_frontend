export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

type GenericRelationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne: boolean
  referencedRelation: string
  referencedColumns: string[]
}

type GenericTable = {
  Row: Record<string, unknown>
  Insert: Record<string, unknown>
  Update: Record<string, unknown>
  Relationships: GenericRelationship[]
}

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
      // Fallback for tables not yet captured by generated types.
      [key: string]: GenericTable
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
