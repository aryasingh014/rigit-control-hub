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
      customer_orders: {
        Row: {
          additional_notes: string | null
          created_at: string | null
          created_by: string | null
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          duration_days: number
          equipment_type: string
          id: string
          location: string
          order_number: string
          quantity: number
          start_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          additional_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email: string
          customer_id?: string | null
          customer_name: string
          customer_phone: string
          duration_days: number
          equipment_type: string
          id?: string
          location: string
          order_number: string
          quantity: number
          start_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          additional_notes?: string | null
          created_at?: string | null
          created_by?: string | null
          customer_email?: string
          customer_id?: string | null
          customer_name?: string
          customer_phone?: string
          duration_days?: number
          equipment_type?: string
          id?: string
          location?: string
          order_number?: string
          quantity?: number
          start_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
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
      invoices: {
        Row: {
          amount: number
          contract_id: string | null
          created_at: string | null
          customer_id: string
          due_date: string
          id: string
          invoice_number: string
          invoice_type: string
          notes: string | null
          paid_date: string | null
          payment_method: string | null
          status: string
          total_amount: number
          updated_at: string | null
          vat_amount: number
          vat_percentage: number
        }
        Insert: {
          amount?: number
          contract_id?: string | null
          created_at?: string | null
          customer_id: string
          due_date: string
          id?: string
          invoice_number: string
          invoice_type: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          vat_percentage?: number
        }
        Update: {
          amount?: number
          contract_id?: string | null
          created_at?: string | null
          customer_id?: string
          due_date?: string
          id?: string
          invoice_number?: string
          invoice_type?: string
          notes?: string | null
          paid_date?: string | null
          payment_method?: string | null
          status?: string
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          vat_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "rental_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          id: string
          invoice_id: string | null
          notes: string | null
          payment_date: string | null
          payment_method: string
          payment_number: string
          status: string
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method: string
          payment_number: string
          status?: string
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_date?: string | null
          payment_method?: string
          payment_number?: string
          status?: string
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
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
          deposit_paid: boolean | null
          deposit_paid_date: string | null
          end_date: string
          grand_total: number | null
          id: string
          inspection_notes: string | null
          payment_terms: string | null
          penalty_charges: number | null
          project_name: string | null
          site_location: string | null
          so_id: string | null
          start_date: string
          status: Database["public"]["Enums"]["contract_status"] | null
          terms: string | null
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
          deposit_paid?: boolean | null
          deposit_paid_date?: string | null
          end_date: string
          grand_total?: number | null
          id?: string
          inspection_notes?: string | null
          payment_terms?: string | null
          penalty_charges?: number | null
          project_name?: string | null
          site_location?: string | null
          so_id?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          terms?: string | null
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
          deposit_paid?: boolean | null
          deposit_paid_date?: string | null
          end_date?: string
          grand_total?: number | null
          id?: string
          inspection_notes?: string | null
          payment_terms?: string | null
          penalty_charges?: number | null
          project_name?: string | null
          site_location?: string | null
          so_id?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["contract_status"] | null
          terms?: string | null
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
          {
            foreignKeyName: "rental_contracts_so_id_fkey"
            columns: ["so_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      return_requests: {
        Row: {
          actual_return_date: string | null
          contract_id: string | null
          created_at: string | null
          customer_id: string
          customer_notes: string | null
          dispute_reason: string | null
          equipment_type: string
          expected_return_date: string
          id: string
          inspected_at: string | null
          inspected_by: string | null
          inspection_notes: string | null
          quantity_damaged: number | null
          quantity_missing: number | null
          quantity_received: number | null
          quantity_returned: number
          request_number: string
          return_type: string
          status: string
          updated_at: string | null
        }
        Insert: {
          actual_return_date?: string | null
          contract_id?: string | null
          created_at?: string | null
          customer_id: string
          customer_notes?: string | null
          dispute_reason?: string | null
          equipment_type: string
          expected_return_date: string
          id?: string
          inspected_at?: string | null
          inspected_by?: string | null
          inspection_notes?: string | null
          quantity_damaged?: number | null
          quantity_missing?: number | null
          quantity_received?: number | null
          quantity_returned: number
          request_number: string
          return_type: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          actual_return_date?: string | null
          contract_id?: string | null
          created_at?: string | null
          customer_id?: string
          customer_notes?: string | null
          dispute_reason?: string | null
          equipment_type?: string
          expected_return_date?: string
          id?: string
          inspected_at?: string | null
          inspected_by?: string | null
          inspection_notes?: string | null
          quantity_damaged?: number | null
          quantity_missing?: number | null
          quantity_received?: number | null
          quantity_returned?: number
          request_number?: string
          return_type?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_requests_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "rental_contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_requests_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_order_items: {
        Row: {
          availability_status: string | null
          created_at: string | null
          cutting_charges: number | null
          description: string | null
          equipment_code: string | null
          equipment_id: string | null
          equipment_type: string
          id: string
          line_total: number
          quantity_available: number | null
          quantity_ordered: number
          rate_per_unit: number
          rental_days: number
          so_id: string
          unit: string
          wastage_charges: number | null
          wastage_percentage: number | null
        }
        Insert: {
          availability_status?: string | null
          created_at?: string | null
          cutting_charges?: number | null
          description?: string | null
          equipment_code?: string | null
          equipment_id?: string | null
          equipment_type: string
          id?: string
          line_total: number
          quantity_available?: number | null
          quantity_ordered: number
          rate_per_unit: number
          rental_days: number
          so_id: string
          unit?: string
          wastage_charges?: number | null
          wastage_percentage?: number | null
        }
        Update: {
          availability_status?: string | null
          created_at?: string | null
          cutting_charges?: number | null
          description?: string | null
          equipment_code?: string | null
          equipment_id?: string | null
          equipment_type?: string
          id?: string
          line_total?: number
          quantity_available?: number | null
          quantity_ordered?: number
          rate_per_unit?: number
          rental_days?: number
          so_id?: string
          unit?: string
          wastage_charges?: number | null
          wastage_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_order_items_equipment_id_fkey"
            columns: ["equipment_id"]
            isOneToOne: false
            referencedRelation: "equipment_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_order_items_so_id_fkey"
            columns: ["so_id"]
            isOneToOne: false
            referencedRelation: "sales_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      sales_orders: {
        Row: {
          approval_date: string | null
          approved_by: string | null
          created_at: string | null
          created_by: string
          customer_email: string
          customer_id: string | null
          customer_name: string
          customer_phone: string
          deposit_amount: number | null
          id: string
          notes: string | null
          project_name: string | null
          quotation_id: string | null
          rejection_reason: string | null
          rental_duration_days: number
          rental_end_date: string
          rental_start_date: string
          site_location: string
          so_number: string
          status: string
          stock_check_status: string | null
          stock_checked_at: string | null
          stock_checked_by: string | null
          subtotal: number
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
          deposit_amount?: number | null
          id?: string
          notes?: string | null
          project_name?: string | null
          quotation_id?: string | null
          rejection_reason?: string | null
          rental_duration_days: number
          rental_end_date: string
          rental_start_date: string
          site_location: string
          so_number: string
          status?: string
          stock_check_status?: string | null
          stock_checked_at?: string | null
          stock_checked_by?: string | null
          subtotal?: number
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
          deposit_amount?: number | null
          id?: string
          notes?: string | null
          project_name?: string | null
          quotation_id?: string | null
          rejection_reason?: string | null
          rental_duration_days?: number
          rental_end_date?: string
          rental_start_date?: string
          site_location?: string
          so_number?: string
          status?: string
          stock_check_status?: string | null
          stock_checked_at?: string | null
          stock_checked_by?: string | null
          subtotal?: number
          total_amount?: number
          updated_at?: string | null
          vat_amount?: number
          vat_percentage?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sales_orders_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
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
      check_stock_availability: {
        Args: { p_so_id: string }
        Returns: {
          equipment_type: string
          is_available: boolean
          item_id: string
          quantity_available: number
          quantity_ordered: number
        }[]
      }
      generate_enquiry_number: { Args: never; Returns: string }
      generate_invoice_number: { Args: never; Returns: string }
      generate_order_number: { Args: never; Returns: string }
      generate_payment_number: { Args: never; Returns: string }
      generate_quotation_number: { Args: never; Returns: string }
      generate_return_request_number: { Args: never; Returns: string }
      generate_so_number: { Args: never; Returns: string }
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
