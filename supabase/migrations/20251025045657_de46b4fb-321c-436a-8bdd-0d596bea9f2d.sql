-- Create sales_orders table
CREATE TABLE public.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_number TEXT NOT NULL UNIQUE,
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  site_location TEXT NOT NULL,
  project_name TEXT,
  rental_start_date DATE NOT NULL,
  rental_end_date DATE NOT NULL,
  rental_duration_days INTEGER NOT NULL,
  subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
  vat_percentage NUMERIC(5, 2) NOT NULL DEFAULT 5,
  vat_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  deposit_amount NUMERIC(10, 2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'confirmed', 'converted_to_contract')),
  stock_check_status TEXT DEFAULT 'pending' CHECK (stock_check_status IN ('pending', 'checking', 'available', 'partial', 'unavailable')),
  stock_checked_by UUID REFERENCES auth.users(id),
  stock_checked_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sales_order_items table
CREATE TABLE public.sales_order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  so_id UUID REFERENCES public.sales_orders(id) ON DELETE CASCADE NOT NULL,
  equipment_id UUID REFERENCES public.equipment_catalog(id),
  equipment_type TEXT NOT NULL,
  equipment_code TEXT,
  description TEXT,
  quantity_ordered NUMERIC(10, 2) NOT NULL,
  quantity_available NUMERIC(10, 2) DEFAULT 0,
  unit TEXT NOT NULL DEFAULT 'pcs',
  rate_per_unit NUMERIC(10, 2) NOT NULL,
  rental_days INTEGER NOT NULL,
  wastage_percentage NUMERIC(5, 2) DEFAULT 0,
  wastage_charges NUMERIC(10, 2) DEFAULT 0,
  cutting_charges NUMERIC(10, 2) DEFAULT 0,
  line_total NUMERIC(10, 2) NOT NULL,
  availability_status TEXT DEFAULT 'pending' CHECK (availability_status IN ('pending', 'available', 'partial', 'unavailable')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update rental_contracts table with additional fields
ALTER TABLE public.rental_contracts 
  ADD COLUMN IF NOT EXISTS so_id UUID REFERENCES public.sales_orders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deposit_paid BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS deposit_paid_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS payment_terms TEXT,
  ADD COLUMN IF NOT EXISTS penalty_charges NUMERIC(10, 2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS inspection_notes TEXT,
  ADD COLUMN IF NOT EXISTS terms TEXT;

-- Enable RLS
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales_orders
CREATE POLICY "Sales, admin, finance, and warehouse can view sales orders"
  ON public.sales_orders FOR SELECT
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role) OR
    has_role(auth.uid(), 'warehouse'::app_role)
  );

CREATE POLICY "Sales can create sales orders"
  ON public.sales_orders FOR INSERT
  WITH CHECK (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Sales, admin, and warehouse can update sales orders"
  ON public.sales_orders FOR UPDATE
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'warehouse'::app_role)
  );

CREATE POLICY "Admin can delete sales orders"
  ON public.sales_orders FOR DELETE
  USING (is_admin(auth.uid()));

-- RLS Policies for sales_order_items
CREATE POLICY "Users can view sales order items if they can view the sales order"
  ON public.sales_order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.sales_orders so
      WHERE so.id = sales_order_items.so_id
      AND (
        is_admin(auth.uid()) OR 
        has_role(auth.uid(), 'sales'::app_role) OR
        has_role(auth.uid(), 'finance'::app_role) OR
        has_role(auth.uid(), 'warehouse'::app_role)
      )
    )
  );

CREATE POLICY "Sales and warehouse can manage sales order items"
  ON public.sales_order_items FOR ALL
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'warehouse'::app_role)
  )
  WITH CHECK (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'warehouse'::app_role)
  );

-- Create indexes for performance
CREATE INDEX idx_sales_orders_status ON public.sales_orders(status);
CREATE INDEX idx_sales_orders_quotation_id ON public.sales_orders(quotation_id);
CREATE INDEX idx_sales_orders_created_by ON public.sales_orders(created_by);
CREATE INDEX idx_sales_orders_stock_check ON public.sales_orders(stock_check_status);
CREATE INDEX idx_sales_order_items_so_id ON public.sales_order_items(so_id);
CREATE INDEX idx_sales_order_items_equipment_id ON public.sales_order_items(equipment_id);
CREATE INDEX idx_contracts_so_id ON public.rental_contracts(so_id);

-- Create trigger for updated_at
CREATE TRIGGER update_sales_orders_updated_at
  BEFORE UPDATE ON public.sales_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate sales order number
CREATE OR REPLACE FUNCTION generate_so_number()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  next_number INTEGER;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(so_number FROM 4) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.sales_orders
  WHERE so_number LIKE 'SO-' || year_suffix || '%';
  
  RETURN 'SO-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Function to check stock availability for sales order
CREATE OR REPLACE FUNCTION check_stock_availability(p_so_id UUID)
RETURNS TABLE (
  item_id UUID,
  equipment_type TEXT,
  quantity_ordered NUMERIC,
  quantity_available NUMERIC,
  is_available BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    soi.id,
    soi.equipment_type,
    soi.quantity_ordered,
    COALESCE(ec.quantity_available, 0) as quantity_available,
    CASE 
      WHEN COALESCE(ec.quantity_available, 0) >= soi.quantity_ordered THEN true
      ELSE false
    END as is_available
  FROM public.sales_order_items soi
  LEFT JOIN public.equipment_catalog ec ON ec.item_code = soi.equipment_code
  WHERE soi.so_id = p_so_id;
END;
$$;