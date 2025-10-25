import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, FileText, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';

interface Contract {
  id: string;
  contract_number: string;
  so_id?: string;
  customer_id?: string;
  project_name?: string;
  site_location?: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: string;
  deposit_paid: boolean;
  payment_terms?: string;
  terms?: string;
  created_at: string;
  created_by?: string;
  approved_by?: string;
}

export const ContractsModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approvedSalesOrders, setApprovedSalesOrders] = useState<any[]>([]);
  const [selectedSO, setSelectedSO] = useState('');
  const [formData, setFormData] = useState({
    deposit_amount: '',
    payment_terms: '',
    terms: '',
  });

  useEffect(() => {
    fetchContracts();
    fetchApprovedSalesOrders();
  }, []);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rental_contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchApprovedSalesOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovedSalesOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching sales orders:', error);
    }
  };

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSO || !user) {
      toast({
        title: 'Validation Error',
        description: 'Please select a sales order',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get sales order details
      const salesOrder = approvedSalesOrders.find(so => so.id === selectedSO);
      if (!salesOrder) throw new Error('Sales Order not found');

      // Generate contract number (simple version, can be improved)
      const year = new Date().getFullYear().toString().slice(-2);
      const count = contracts.length + 1;
      const contractNumber = `RC-${year}-${String(count).padStart(3, '0')}`;

      // Create contract
      const { data: contractData, error: contractError } = await supabase
        .from('rental_contracts')
        .insert([{
          contract_number: contractNumber,
          so_id: salesOrder.id,
          customer_id: salesOrder.customer_id,
          project_name: salesOrder.project_name,
          site_location: salesOrder.site_location,
          start_date: salesOrder.rental_start_date,
          end_date: salesOrder.rental_end_date,
          total_amount: salesOrder.total_amount,
          vat_amount: salesOrder.vat_amount,
          grand_total: salesOrder.total_amount + salesOrder.vat_amount,
          payment_terms: formData.payment_terms,
          terms: formData.terms,
          deposit_paid: false,
          created_by: user.id,
        }])
        .select()
        .single();

      if (contractError) throw contractError;

      // Update sales order status
      await supabase
        .from('sales_orders')
        .update({ status: 'converted_to_contract' })
        .eq('id', salesOrder.id);

      toast({
        title: 'Success',
        description: `Contract ${contractNumber} created successfully`,
      });

      setDialogOpen(false);
      setSelectedSO('');
      setFormData({ deposit_amount: '', payment_terms: '', terms: '' });
      fetchContracts();
      fetchApprovedSalesOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveContract = async (contract: Contract) => {
    try {
      const { error } = await supabase
        .from('rental_contracts')
        .update({ 
          status: 'active',
          approved_by: user?.id 
        })
        .eq('id', contract.id);

      if (error) throw error;

      toast({
        title: 'Contract Approved',
        description: `${contract.contract_number} has been approved and activated.`,
      });

      fetchContracts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleRejectContract = async (contract: Contract) => {
    try {
      const { error } = await supabase
        .from('rental_contracts')
        .update({ status: 'draft' })
        .eq('id', contract.id);

      if (error) throw error;

      toast({
        title: 'Contract Rejected',
        description: `${contract.contract_number} has been rejected.`,
      });

      fetchContracts();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      draft: 'secondary',
      active: 'default',
      completed: 'secondary',
      pending: 'outline',
      rejected: 'destructive',
      cancelled: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const isRenewalDue = (endDate: string) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contract Oversight</h3>
          <p className="text-sm text-muted-foreground">Create contracts from approved sales orders and manage lease agreements</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Contract
        </Button>
      </div>

      {/* Create Contract Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create Lease Agreement</DialogTitle>
            <DialogDescription>Convert an approved sales order into a rental contract</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateContract} className="space-y-4">
            <div className="space-y-2">
              <Label>Approved Sales Order *</Label>
              <Select value={selectedSO} onValueChange={setSelectedSO}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sales order" />
                </SelectTrigger>
                <SelectContent>
                  {approvedSalesOrders.map((so) => (
                    <SelectItem key={so.id} value={so.id}>
                      {so.so_number} - {so.customer_name} - {so.project_name || 'N/A'} - AED {so.total_amount.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment_terms">Payment Terms</Label>
              <Select value={formData.payment_terms} onValueChange={(val) => setFormData({ ...formData, payment_terms: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_advance">Full Advance Payment</SelectItem>
                  <SelectItem value="50_advance">50% Advance, 50% on Delivery</SelectItem>
                  <SelectItem value="30_60_10">30% Advance, 60% on Delivery, 10% on Return</SelectItem>
                  <SelectItem value="net_30">Net 30 Days</SelectItem>
                  <SelectItem value="net_60">Net 60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Contract Terms & Conditions</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                rows={5}
                placeholder="Enter contract terms and conditions..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting || !selectedSO}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Contract'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Contracts Table */}
      <div className="border rounded-lg">
        {contracts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No contracts found</p>
            <p className="text-sm text-muted-foreground mt-2">Create a contract from an approved sales order</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract #</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Site Location</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Renewal Alert</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Deposit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.contract_number}</TableCell>
                  <TableCell>{contract.project_name || 'N/A'}</TableCell>
                  <TableCell className="text-sm">{contract.site_location || 'N/A'}</TableCell>
                  <TableCell className="text-sm">{new Date(contract.start_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-sm">{new Date(contract.end_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {isRenewalDue(contract.end_date) && contract.status === 'active' ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        <span className="text-sm text-orange-600 font-medium">Due Soon</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="font-semibold">AED {contract.total_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={contract.deposit_paid ? 'default' : 'secondary'}>
                      {contract.deposit_paid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      {contract.status === 'draft' && (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Approve Contract" 
                            onClick={() => handleApproveContract(contract)}
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Reject Contract" 
                            onClick={() => handleRejectContract(contract)}
                          >
                            <XCircle className="h-4 w-4 text-red-600" />
                          </Button>
                        </>
                      )}
                      <Button variant="ghost" size="icon" title="View Details">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Contracts</div>
          <div className="text-2xl font-bold">{contracts.length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Active Contracts</div>
          <div className="text-2xl font-bold">{contracts.filter(c => c.status === 'active').length}</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Renewal Alerts</div>
          <div className="text-2xl font-bold">
            {contracts.filter(c => isRenewalDue(c.end_date) && c.status === 'active').length}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">Total Value</div>
          <div className="text-2xl font-bold">
            AED {contracts.filter(c => c.status === 'active').reduce((sum, c) => sum + c.total_amount, 0).toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};