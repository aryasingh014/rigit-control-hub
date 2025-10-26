import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, Download, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const InvoicesModule = () => {
  const { user } = useAuth();
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const { data: invoices, refetch } = useQuery({
    queryKey: ['invoices', customerInfo?.id],
    queryFn: async () => {
      if (!customerInfo?.id) return [];
      const { data, error } = await supabase.from('invoices').select('*').eq('customer_id', customerInfo.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!customerInfo?.id
  });

  const totalOutstanding = invoices?.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue').reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

  const handlePayment = async () => {
    if (!selectedInvoice || !paymentMethod) {
      toast.error('Please select payment method');
      return;
    }
    setIsProcessing(true);
    try {
      const { data: paymentNumber } = await supabase.rpc('generate_payment_number');
      const { error: paymentError } = await supabase.from('payments').insert({
        payment_number: paymentNumber,
        invoice_id: selectedInvoice.id,
        customer_id: customerInfo?.id,
        amount: selectedInvoice.total_amount,
        payment_method: paymentMethod,
        transaction_id: transactionId || null,
        status: 'completed'
      });
      if (paymentError) throw paymentError;
      const { error: invoiceError } = await supabase.from('invoices').update({ status: 'paid', paid_date: new Date().toISOString(), payment_method: paymentMethod }).eq('id', selectedInvoice.id);
      if (invoiceError) throw invoiceError;
      toast.success('Payment processed successfully!');
      setPaymentDialogOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to process payment');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-primary" />
          <div><h3 className="text-2xl font-bold">Invoices & Payments</h3><p className="text-muted-foreground">Manage your invoices and payment history</p></div>
        </div>
        <Card className="w-64"><CardContent className="pt-6"><div className="text-center"><p className="text-sm text-muted-foreground">Outstanding Balance</p><p className="text-3xl font-bold text-destructive">${totalOutstanding.toLocaleString()}</p></div></CardContent></Card>
      </div>
      <Card>
        <CardHeader><CardTitle>All Invoices</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Invoice No.</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Total</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {!invoices || invoices.length === 0 ? (<TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No invoices found</TableCell></TableRow>) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell className="capitalize">{invoice.invoice_type.replace('_', ' ')}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="font-bold">${invoice.total_amount.toLocaleString()}</TableCell>
                    <TableCell><Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>{invoice.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />PDF</Button>
                        {(invoice.status === 'unpaid' || invoice.status === 'overdue') && (
                          <Dialog open={paymentDialogOpen} onOpenChange={setPaymentDialogOpen}>
                            <DialogTrigger asChild><Button size="sm" onClick={() => setSelectedInvoice(invoice)}><CreditCard className="h-4 w-4 mr-1" />Pay Now</Button></DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle>Process Payment</DialogTitle></DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2"><Label>Amount</Label><Input value={`$${selectedInvoice?.total_amount.toLocaleString()}`} disabled /></div>
                                <div className="space-y-2"><Label>Payment Method *</Label><Select value={paymentMethod} onValueChange={setPaymentMethod}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="upi">UPI</SelectItem><SelectItem value="card">Card</SelectItem></SelectContent></Select></div>
                              </div>
                              <DialogFooter><Button onClick={handlePayment} disabled={isProcessing}>{isProcessing ? 'Processing...' : 'Confirm'}</Button></DialogFooter>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
