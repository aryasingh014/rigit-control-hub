import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Package, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export const ReturnRequestsModule = () => {
  const { user } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ contract_id: '', equipment_type: '', quantity_returned: '', return_type: '', customer_notes: '' });

  const { data: customerInfo } = useQuery({
    queryKey: ['customer-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase.from('customers').select('*').eq('email', user.email).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  const { data: contracts } = useQuery({
    queryKey: ['active-contracts', customerInfo?.id],
    queryFn: async () => {
      if (!customerInfo?.id) return [];
      const { data, error } = await supabase.from('rental_contracts').select('*').eq('customer_id', customerInfo.id).eq('status', 'active');
      if (error) throw error;
      return data;
    },
    enabled: !!customerInfo?.id
  });

  const { data: returnRequests, refetch } = useQuery({
    queryKey: ['return-requests', customerInfo?.id],
    queryFn: async () => {
      if (!customerInfo?.id) return [];
      const { data, error } = await supabase.from('return_requests').select('*').eq('customer_id', customerInfo.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!customerInfo?.id
  });

  const handleSubmit = async () => {
    try {
      const { data: requestNumber } = await supabase.rpc('generate_return_request_number');
      const { error } = await supabase.from('return_requests').insert({ request_number: requestNumber, contract_id: formData.contract_id, customer_id: customerInfo?.id, equipment_type: formData.equipment_type, quantity_returned: parseFloat(formData.quantity_returned), expected_return_date: format(new Date(), 'yyyy-MM-dd'), return_type: formData.return_type, customer_notes: formData.customer_notes });
      if (error) throw error;
      toast.success('Return request submitted!');
      setDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><Package className="h-6 w-6 text-primary" /><div><h3 className="text-2xl font-bold">Return Requests</h3></div></div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Request</Button></DialogTrigger>
          <DialogContent><DialogHeader><DialogTitle>Submit Return Request</DialogTitle></DialogHeader><div className="space-y-4"><div className="space-y-2"><Label>Contract</Label><Select value={formData.contract_id} onValueChange={(v) => setFormData({...formData, contract_id: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{contracts?.map((c) => <SelectItem key={c.id} value={c.id}>{c.contract_number}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label>Equipment</Label><Input value={formData.equipment_type} onChange={(e) => setFormData({...formData, equipment_type: e.target.value})} /></div></div><DialogFooter><Button onClick={handleSubmit}>Submit</Button></DialogFooter></DialogContent>
        </Dialog>
      </div>
      <Card><CardContent className="p-0"><Table><TableHeader><TableRow><TableHead>Request ID</TableHead><TableHead>Equipment</TableHead><TableHead>Status</TableHead></TableRow></TableHeader><TableBody>{!returnRequests || returnRequests.length === 0 ? <TableRow><TableCell colSpan={3} className="text-center py-8">No requests</TableCell></TableRow> : returnRequests.map((r) => <TableRow key={r.id}><TableCell>{r.request_number}</TableCell><TableCell>{r.equipment_type}</TableCell><TableCell><Badge>{r.status}</Badge></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    </div>
  );
};
