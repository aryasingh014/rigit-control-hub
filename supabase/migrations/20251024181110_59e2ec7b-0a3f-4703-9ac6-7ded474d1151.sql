-- Create customer_enquiries table
CREATE TABLE public.customer_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  project_name TEXT,
  site_location TEXT NOT NULL,
  equipment_required TEXT NOT NULL,
  rental_duration TEXT NOT NULL,
  start_date DATE,
  project_details TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'quoted', 'converted', 'lost')),
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'phone', 'email', 'walk-in')),
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT
);

-- Create quotations table
CREATE TABLE public.quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_number TEXT NOT NULL UNIQUE,
  enquiry_id UUID REFERENCES public.customer_enquiries(id) ON DELETE SET NULL,
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
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'sent', 'accepted', 'converted')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
  approval_date TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  notes TEXT,
  terms_and_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotation_items table
CREATE TABLE public.quotation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES public.quotations(id) ON DELETE CASCADE NOT NULL,
  equipment_type TEXT NOT NULL,
  equipment_code TEXT,
  description TEXT,
  quantity NUMERIC(10, 2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'pcs',
  length NUMERIC(10, 2),
  breadth NUMERIC(10, 2),
  size_sqft NUMERIC(10, 2),
  rate_per_unit NUMERIC(10, 2) NOT NULL,
  rate_type TEXT DEFAULT 'per_day' CHECK (rate_type IN ('per_day', 'per_sqft_day', 'per_piece')),
  rental_days INTEGER NOT NULL,
  wastage_percentage NUMERIC(5, 2) DEFAULT 0,
  wastage_charges NUMERIC(10, 2) DEFAULT 0,
  cutting_charges NUMERIC(10, 2) DEFAULT 0,
  line_total NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.customer_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotation_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customer_enquiries
CREATE POLICY "Sales and admin can view all enquiries"
  ON public.customer_enquiries FOR SELECT
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Sales and admin can create enquiries"
  ON public.customer_enquiries FOR INSERT
  WITH CHECK (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Sales and admin can update enquiries"
  ON public.customer_enquiries FOR UPDATE
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Sales and admin can delete enquiries"
  ON public.customer_enquiries FOR DELETE
  USING (is_admin(auth.uid()));

-- RLS Policies for quotations
CREATE POLICY "Sales, admin, and finance can view quotations"
  ON public.quotations FOR SELECT
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role) OR
    has_role(auth.uid(), 'finance'::app_role)
  );

CREATE POLICY "Sales can create quotations"
  ON public.quotations FOR INSERT
  WITH CHECK (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Sales and admin can update quotations"
  ON public.quotations FOR UPDATE
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

CREATE POLICY "Admin can delete quotations"
  ON public.quotations FOR DELETE
  USING (is_admin(auth.uid()));

-- RLS Policies for quotation_items
CREATE POLICY "Users can view quotation items if they can view the quotation"
  ON public.quotation_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quotations q
      WHERE q.id = quotation_items.quotation_id
      AND (
        is_admin(auth.uid()) OR 
        has_role(auth.uid(), 'sales'::app_role) OR
        has_role(auth.uid(), 'finance'::app_role)
      )
    )
  );

CREATE POLICY "Sales can manage quotation items"
  ON public.quotation_items FOR ALL
  USING (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  )
  WITH CHECK (
    is_admin(auth.uid()) OR 
    has_role(auth.uid(), 'sales'::app_role)
  );

-- Create indexes for performance
CREATE INDEX idx_enquiries_status ON public.customer_enquiries(status);
CREATE INDEX idx_enquiries_assigned_to ON public.customer_enquiries(assigned_to);
CREATE INDEX idx_enquiries_created_at ON public.customer_enquiries(created_at DESC);
CREATE INDEX idx_quotations_status ON public.quotations(status);
CREATE INDEX idx_quotations_enquiry_id ON public.quotations(enquiry_id);
CREATE INDEX idx_quotations_created_by ON public.quotations(created_by);
CREATE INDEX idx_quotation_items_quotation_id ON public.quotation_items(quotation_id);

-- Create trigger for updated_at
CREATE TRIGGER update_enquiries_updated_at
  BEFORE UPDATE ON public.customer_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at
  BEFORE UPDATE ON public.quotations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to generate enquiry number
CREATE OR REPLACE FUNCTION generate_enquiry_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(enquiry_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.customer_enquiries
  WHERE enquiry_number LIKE 'ENQ-' || year_suffix || '%';
  
  RETURN 'ENQ-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to generate quotation number
CREATE OR REPLACE FUNCTION generate_quotation_number()
RETURNS TEXT AS $$
DECLARE
  next_number INTEGER;
  year_suffix TEXT;
BEGIN
  year_suffix := TO_CHAR(NOW(), 'YY');
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.quotations
  WHERE quotation_number LIKE 'QUO-' || year_suffix || '%';
  
  RETURN 'QUO-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;