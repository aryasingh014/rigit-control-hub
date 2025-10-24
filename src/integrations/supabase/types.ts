export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      customer_enquiries: {
        Row: {
          assigned_to: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          customer_name: string
          email: string
          enquiry_number: string
          equipment_required: string
          id: string
          notes: string | null
          phone: string
          project_details: string | null
          project_name: string | null
          rental_duration: string
          site_location: string
          source: string | null
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_name: string
          email: string
          enquiry_number: string
          equipment_required: string
          id?: string
          notes?: string | null
          phone: string
          project_details?: string | null
          project_name?: string | null
          rental_duration: string
          site_location: string
          source?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_name?: string
          email?: string
          enquiry_number?: string
          equipment_required?: string
          id?: string
          notes?: string | null
          phone?: string
          project_details?: string | null
          project_name?: string | null
          rental_duration?: string
          site_location?: string
          source?: string | null
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          cr_number: string | null
          created_at: string | null
          credit_limit: number | null
          deposit_amount: number | null
          email: string | null
          id: string
          name: string
          phone: string | null
          updated_at: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          cr_number?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deposit_amount?: number | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          cr_number?: string | null
          created_at?: string | null
          credit_limit?: number | null
          deposit_amount?: number | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string | null
          vat_number?: string | null
        }
        Relationships: []
      }
      equipment_catalog: {
        Row: {
          category: string | null
          created_at: string | null
          daily_rate: number
          description: string
          id: string
          item_code: string
          quantity_available: number
          quantity_total: number
          status: Database["public"]["Enums"]["equipment_status"] | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          daily_rate: number
          description: string
          id?: string
          item_code: string
          quantity_available?: number
          quantity_total?: number
          status?: Database["public"]["Enums"]["equipment_status"] | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          daily_rate?: number
          description?: string
          id?: string
          item_code?: string
          quantity_available?: number
          quantity_total?: number
          status?: Database["public"]["Enums"]["equipment_status"] | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      quotation_items: {
        Row: {
          breadth: number | null
          created_at: string | null
          cutting_charges: number | null
          description: string | null
          equipment_code: string | null
          equipment_type: string
          id: string
          length: number | null
          line_total: number
          quantity: number
          quotation_id: string
          rate_per_unit: number
          rate_type: string | null
          rental_days: number
          size_sqft: number | null
          unit: string
          wastage_charges: number | null
          wastage_percentage: number | null
        }
        Insert: {
          breadth?: number | null
          created_at?: string | null
          cutting_charges?: number | null
          description?: string | null
          equipment_code?: string | null
          equipment_type: string
          id?: string
          length?: number | null
          line_total: number
          quantity: number
          quotation_id: string
          rate_per_unit: number
          rate_type?: string | null
          rental_days: number
          size_sqft?: number | null
          unit?: string
          wastage_charges?: number | null
          wastage_percentage?: number | null
        }
        Update: {
          breadth?: number | null
          created_at?: string | null
          cutting_charges?: number | null
          description?: string | null
          equipment_code?: string | null
          equipment_type?: string
          id?: string
          length?: number | null
          line_total?: number
          quantity?: number
          quotation_id?: string
          rate_per_unit?: number
          rate_type?: string | null
          rental_days?: number
          size_sqft?: number | null
          unit?: string
          wastage_charges?: number | null
          wastage_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotation_items_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          enquiry_id: string | null
          id: string
          notes: string | null
          project_name: string | null
          quotation_number: string
          rejection_reason: string | null
          rental_duration_days: number
          rental_end_date: string
          rental_start_date: string
          site_location: string
          status: string
          subtotal: number
          terms_and_conditions: string | null
          total_amount: number
          updated_at: string | null
          vat_amount: number
          vat_percentage: number
        }
        Insert: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by: string
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          enquiry_id?: string | null
          id?: string
          notes?: string | null
          project_name?: string | null
          quotation_number: string
          rejection_reason?: string | null
          rental_duration_days: number
          rental_end_date: string
          rental_start_date: string
          site_location: string
          status?: string
          subtotal?: number
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          vat_percentage?: number
        }
        Update: {
          approval_date?: string | null
          approved_by?: string | null
          created_at?: string | null
          created_by?: string
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          enquiry_id?: string | null
          id?: string
          notes?: string | null
          project_name?: string | null
          quotation_number?: string
          rejection_reason?: string | null
          rental_duration_days?: number
          rental_end_date?: string
          rental_start_date?: string
          site_location?: string
          status?: string
          subtotal?: number
          terms_and_conditions?: string | null
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          vat_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "quotations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_enquiry_id_fkey"
            columns: ["enquiry_id"]
            isOneToOne: false
            referencedRelation: "customer_enquiries"
            referencedColumns: ["id"]
          },
        ]
      }
      rental_contracts: {
        Row: {
          approved_by: string | null
          contract_number: string
          created_at: string | null
          created_by: string | null
          customer_id: string
          end_date: string
          grand_total: number | null
          id: string
          project_name: string | null
          site_location: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          total_amount: number | null
          updated_at: string | null
          vat_amount: number | null
        }
        Insert: {
          approved_by?: string | null
          contract_number: string
          created_at?: string | null
          created_by?: string | null
          customer_id: string
          end_date: string
          grand_total?: number | null
          id?: string
          project_name?: string | null
          site_location?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
        }
        Update: {
          approved_by?: string | null
          contract_number?: string
          created_at?: string | null
          created_by?: string | null
          customer_id?: string
          end_date?: string
          grand_total?: number | null
          id?: string
          project_name?: string | null
          site_location?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          total_amount?: number | null
          updated_at?: string | null
          vat_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "rental_contracts_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_contracts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rental_contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          address: string | null
          cr_number: string | null
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string | null
          trade_license: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          cr_number?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          trade_license?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          cr_number?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          trade_license?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_enquiry_number: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "admin"
        | "sales"
        | "warehouse"
        | "finance"
        | "vendor"
        | "customer"
      contract_status:
        | "draft"
        | "pending_approval"
        | "active"
        | "extended"
        | "returned"
        | "closed"
      equipment_status:
        | "available"
        | "reserved"
        | "on_rent"
        | "maintenance"
        | "damaged"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "sales",
        "warehouse",
        "finance",
        "vendor",
        "customer",
      ],
      contract_status: [
        "draft",
        "pending_approval",
        "active",
        "extended",
        "returned",
        "closed",
      ],
      equipment_status: [
        "available",
        "reserved",
        "on_rent",
        "maintenance",
        "damaged",
      ],
    },
  },
} as const
