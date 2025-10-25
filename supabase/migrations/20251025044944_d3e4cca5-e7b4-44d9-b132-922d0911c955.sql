-- Fix search_path security for enquiry number generation function
CREATE OR REPLACE FUNCTION generate_enquiry_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(enquiry_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.customer_enquiries
  WHERE enquiry_number LIKE 'ENQ-' || year_suffix || '%';
  
  RETURN 'ENQ-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;

-- Fix search_path security for quotation number generation function
CREATE OR REPLACE FUNCTION generate_quotation_number()
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
  
  SELECT COALESCE(MAX(CAST(SUBSTRING(quotation_number FROM 5) AS INTEGER)), 0) + 1
  INTO next_number
  FROM public.quotations
  WHERE quotation_number LIKE 'QUO-' || year_suffix || '%';
  
  RETURN 'QUO-' || year_suffix || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$;