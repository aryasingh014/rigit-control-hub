-- Create invoices table
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT NOT NULL UNIQUE,
  contract_id UUID REFERENCES public.rental_contracts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  invoice_type TEXT NOT NULL CHECK (invoice_type IN ('initial', 'final', 'penalty', 'deposit_refund')),
  amount NUMERIC NOT NULL DEFAULT 0,
  vat_percentage NUMERIC NOT NULL DEFAULT 5,
  vat_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount NUMERIC NOT NULL DEFAULT 0,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid', 'overdue', 'cancelled')),
  payment_method TEXT,
  paid_date TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_number TEXT NOT NULL UNIQUE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('upi', 'card', 'net_banking', 'cash', 'cheque')),
  payment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  transaction_id TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create return_requests table
CREATE TABLE public.return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number TEXT NOT NULL UNIQUE,
  contract_id UUID REFERENCES public.rental_contracts(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) NOT NULL,
  equipment_type TEXT NOT NULL,
  quantity_returned NUMERIC NOT NULL,
  expected_return_date DATE NOT NULL,
  actual_return_date DATE,
  return_type TEXT NOT NULL CHECK (return_type IN ('early_return', 'normal_return', 'lost_item', 'damaged_item')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'inspected', 'approved', 'rejected', 'disputed')),
  inspection_notes TEXT,
  quantity_received NUMERIC,
  quantity_damaged NUMERIC,
  quantity_missing NUMERIC,
  customer_notes TEXT,
  dispute_reason TEXT,
  inspected_by UUID,
  inspected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('rental_expiry', 'payment_due', 'return_confirmation', 'invoice', 'penalty', 'general')),
  reference_id UUID,
  reference_type TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customer_orders table
CREATE TABLE public.customer_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  equipment_type TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  duration_days INTEGER NOT NULL,
  location TEXT NOT NULL,
  start_date DATE NOT NULL,
  additional_notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'approved', 'rejected', 'converted_to_quotation')),
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for invoices
CREATE POLICY "Customers can view their own invoices"
ON public.invoices FOR SELECT
USING (customer_id IN (SELECT id FROM public.customers WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Finance and admin can manage invoices"
ON public.invoices FOR ALL
USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'finance'::app_role))
WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'finance'::app_role));

-- RLS Policies for payments
CREATE POLICY "Customers can view their own payments"
ON public.payments FOR SELECT
USING (customer_id IN (SELECT id FROM public.customers WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Customers can create payments"
ON public.payments FOR INSERT
WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Finance and admin can manage payments"
ON public.payments FOR ALL
USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'finance'::app_role))
WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'finance'::app_role));

-- RLS Policies for return_requests
CREATE POLICY "Customers can view their own return requests"
ON public.return_requests FOR SELECT
USING (customer_id IN (SELECT id FROM public.customers WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Customers can create return requests"
ON public.return_requests FOR INSERT
WITH CHECK (customer_id IN (SELECT id FROM public.customers WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Customers can update their own return requests"
ON public.return_requests FOR UPDATE
USING (customer_id IN (SELECT id FROM public.customers WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Warehouse and admin can manage return requests"
ON public.return_requests FOR ALL
USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'warehouse'::app_role))
WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'warehouse'::app_role));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "System can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin can manage all notifications"
ON public.notifications FOR ALL
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- RLS Policies for customer_orders
CREATE POLICY "Customers can view their own orders"
ON public.customer_orders FOR SELECT
USING (customer_email = auth.jwt()->>'email' OR is_admin(auth.uid()) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Customers can create orders"
ON public.customer_orders FOR INSERT
WITH CHECK (customer_email = auth.jwt()->>'email');

CREATE POLICY "Sales and admin can manage orders"
ON public.customer_orders FOR ALL
USING (is_admin(auth.uid()) OR has_role(auth.uid(), 'sales'::app_role))
WITH CHECK (is_admin(auth.uid()) OR has_role(auth.uid(), 'sales'::app_role));

-- Create triggers for updated_at
CREATE TRIGGER update_invoices_updated_at
BEFORE UPDATE ON public.invoices
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_return_requests_updated_at
BEFORE UPDATE ON public.return_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customer_orders_updated_at
BEFORE UPDATE ON public.customer_orders
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.invoices
  WHERE invoice_number LIKE 'INV-' || year_suffix || '%';
  
  RETURN 'INV-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Create function to generate payment number
CREATE OR REPLACE FUNCTION public.generate_payment_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(payment_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.payments
  WHERE payment_number LIKE 'PAY-' || year_suffix || '%';
  
  RETURN 'PAY-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Create function to generate return request number
CREATE OR REPLACE FUNCTION public.generate_return_request_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(request_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.return_requests
  WHERE request_number LIKE 'RET-' || year_suffix || '%';
  
  RETURN 'RET-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Create function to generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.customer_orders
  WHERE order_number LIKE 'ORD-' || year_suffix || '%';
  
  RETURN 'ORD-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;