import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Package, Send } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

export const OrderModule = () => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState<Date>();
  const [formData, setFormData] = useState({
    equipment_type: '',
    quantity: '',
    duration_days: '',
    location: '',
    additional_notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch equipment catalog
  const { data: equipmentList } = useQuery({
    queryKey: ['equipment-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment_catalog')
        .select('*')
        .order('description');
      if (error) throw error;
      return data;
    }
  });

  // Fetch customer info
  const { data: customerInfo } = useQuery({
    queryKey: ['customer-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !user?.email) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Generate order number
      const { data: orderNumber } = await supabase.rpc('generate_order_number');

      // Get profile info
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, phone')
        .eq('id', user.id)
        .single();

      const { error } = await supabase.from('customer_orders').insert({
        order_number: orderNumber,
        customer_id: customerInfo?.id,
        customer_name: profile?.full_name || 'Customer',
        customer_email: user.email,
        customer_phone: profile?.phone || '',
        equipment_type: formData.equipment_type,
        quantity: parseFloat(formData.quantity),
        duration_days: parseInt(formData.duration_days),
        location: formData.location,
        start_date: format(startDate, 'yyyy-MM-dd'),
        additional_notes: formData.additional_notes,
        created_by: user.id
      });

      if (error) throw error;

      toast.success('Order submitted successfully! Our sales team will contact you shortly.');
      
      // Reset form
      setFormData({
        equipment_type: '',
        quantity: '',
        duration_days: '',
        location: '',
        additional_notes: ''
      });
      setStartDate(undefined);
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit order');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-2xl font-bold">Place New Order</h3>
          <p className="text-muted-foreground">Request equipment rental - our team will process your order</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipment Rental Request</CardTitle>
          <CardDescription>Fill in your requirements and we'll get back to you with a quotation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Type *</Label>
                <Select
                  value={formData.equipment_type}
                  onValueChange={(value) => setFormData({ ...formData, equipment_type: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select equipment" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentList?.map((item) => (
                      <SelectItem key={item.id} value={item.description}>
                        {item.description} ({item.item_code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 30"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="location">Site Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g., Chennai Construction Site, Area 5"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Additional Requirements</Label>
                <Textarea
                  id="notes"
                  placeholder="Any specific requirements or notes..."
                  value={formData.additional_notes}
                  onChange={(e) => setFormData({ ...formData, additional_notes: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Submitting...' : 'Submit Order Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</div>
            <div>
              <p className="font-medium">Order Review</p>
              <p className="text-sm text-muted-foreground">Our sales team reviews your request</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</div>
            <div>
              <p className="font-medium">Stock Check</p>
              <p className="text-sm text-muted-foreground">We verify equipment availability</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</div>
            <div>
              <p className="font-medium">Quotation</p>
              <p className="text-sm text-muted-foreground">You'll receive a detailed quotation via email</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">4</div>
            <div>
              <p className="font-medium">Contract & Delivery</p>
              <p className="text-sm text-muted-foreground">Once approved, we'll schedule delivery</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
