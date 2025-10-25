import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ShoppingCart, CheckCircle, AlertTriangle, Send, Loader2, FileText, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalesOrder {
  id: string;
  so_number: string;
  quotation_id?: string;
  customer_name: string;
  customer_email: string;
  project_name?: string;
  site_location: string;
  total_amount: number;
  deposit_amount: number;
  status: string;
  stock_check_status: string;
  created_at: string;
  items?: any[];
}

const SalesOrderManagementModule = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [approvedQuotations, setApprovedQuotations] = useState<any[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState('');
  const [stockCheckDialogOpen, setStockCheckDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [stockCheckResults, setStockCheckResults] = useState<any[]>([]);

  useEffect(() => {
    fetchSalesOrders();
    fetchApprovedQuotations();
  }, []);

  const fetchSalesOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('sales_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSalesOrders(data || []);
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

  const fetchApprovedQuotations = async () => {
    try {
      const { data, error } = await supabase
        .from('quotations')
        .select('*')
        .eq('status', 'approved')
        .is('so_id', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApprovedQuotations(data || []);
    } catch (error: any) {
      console.error('Error fetching quotations:', error);
    }
  };

  const handleConvertToSO = async () => {
    if (!selectedQuotation || !user) {
      toast({
        title: 'Validation Error',
        description: 'Please select a quotation to convert',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    try {
      // Get quotation details
      const quotation = approvedQuotations.find(q => q.id === selectedQuotation);
      if (!quotation) throw new Error('Quotation not found');

      // Get quotation items
      const { data: quotationItems, error: itemsError } = await supabase
        .from('quotation_items')
        .select('*')
        .eq('quotation_id', quotation.id);

      if (itemsError) throw itemsError;

      // Generate SO number
      const { data: soNumber, error: soNumberError } = await supabase
        .rpc('generate_so_number');

      if (soNumberError) throw soNumberError;

      // Create sales order
      const { data: soData, error: soError } = await supabase
        .from('sales_orders')
        .insert([{
          so_number: soNumber,
          quotation_id: quotation.id,
          customer_name: quotation.customer_name,
          customer_email: quotation.customer_email,
          customer_phone: quotation.customer_phone,
          site_location: quotation.site_location,
          project_name: quotation.project_name,
          rental_start_date: quotation.rental_start_date,
          rental_end_date: quotation.rental_end_date,
          rental_duration_days: quotation.rental_duration_days,
          subtotal: quotation.subtotal,
          vat_percentage: quotation.vat_percentage,
          vat_amount: quotation.vat_amount,
          total_amount: quotation.total_amount,
          deposit_amount: quotation.total_amount * 0.1, // 10% deposit
          created_by: user.id,
        }])
        .select()
        .single();

      if (soError) throw soError;

      // Create sales order items
      const soItems = quotationItems.map(item => ({
        so_id: soData.id,
        equipment_type: item.equipment_type,
        equipment_code: item.equipment_code,
        description: item.description,
        quantity_ordered: item.quantity,
        unit: item.unit,
        rate_per_unit: item.rate_per_unit,
        rental_days: item.rental_days,
        wastage_percentage: item.wastage_percentage,
        wastage_charges: item.wastage_charges,
        cutting_charges: item.cutting_charges,
        line_total: item.line_total,
      }));

      const { error: itemsInsertError } = await supabase
        .from('sales_order_items')
        .insert(soItems);

      if (itemsInsertError) throw itemsInsertError;

      // Update quotation status
      await supabase
        .from('quotations')
        .update({ status: 'converted' })
        .eq('id', quotation.id);

      toast({
        title: 'Success',
        description: `Sales Order ${soNumber} created successfully`,
      });

      setDialogOpen(false);
      setSelectedQuotation('');
      fetchSalesOrders();
      fetchApprovedQuotations();
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

  const handleCheckStock = async (order: SalesOrder) => {
    setSelectedOrder(order);
    setStockCheckDialogOpen(true);
    
    try {
      // Call stock check function
      const { data, error } = await supabase
        .rpc('check_stock_availability', { p_so_id: order.id });

      if (error) throw error;
      setStockCheckResults(data || []);

      // Update stock check status
      const allAvailable = data?.every((item: any) => item.is_available) || false;
      const partialAvailable = data?.some((item: any) => item.is_available) || false;
      
      const stockStatus = allAvailable ? 'available' : (partialAvailable ? 'partial' : 'unavailable');

      await supabase
        .from('sales_orders')
        .update({
          stock_check_status: stockStatus,
          stock_checked_by: user?.id,
          stock_checked_at: new Date().toISOString(),
        })
        .eq('id', order.id);

      // Update item availability
      if (data) {
        for (const item of data) {
          await supabase
            .from('sales_order_items')
            .update({
              quantity_available: item.quantity_available,
              availability_status: item.is_available ? 'available' : 'unavailable',
            })
            .eq('id', item.item_id);
        }
      }

      fetchSalesOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleSendForApproval = async (orderId: string) => {
    try {
      const { error } = await supabase
        .from('sales_orders')
        .update({ status: 'pending_approval' })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Sales Order sent for approval',
      });

      fetchSalesOrders();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      draft: 'secondary',
      pending_approval: 'outline',
      approved: 'default',
      rejected: 'destructive',
      confirmed: 'default',
      converted_to_contract: 'default',
    };

    const labels: Record<string, string> = {
      draft: 'Draft',
      pending_approval: 'Pending Approval',
      approved: 'Approved',
      rejected: 'Rejected',
      confirmed: 'Confirmed',
      converted_to_contract: 'Converted',
    };

    return <Badge variant={variants[status] || 'outline'}>{labels[status] || status}</Badge>;
  };

  const getStockStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      checking: 'outline',
      available: 'default',
      partial: 'outline',
      unavailable: 'destructive',
    };

    const icons: Record<string, any> = {
      available: <CheckCircle className="h-3 w-3 mr-1" />,
      unavailable: <AlertTriangle className="h-3 w-3 mr-1" />,
      partial: <Package className="h-3 w-3 mr-1" />,
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="flex items-center gap-1">
        {icons[status]}
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sales Order Management</h3>
          <p className="text-sm text-muted-foreground">Convert quotations to sales orders and check stock availability</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Convert Quotation to SO
        </Button>
      </div>

      {/* Convert Quotation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Quotation to Sales Order</DialogTitle>
            <DialogDescription>
              Select an approved quotation to convert into a sales order
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Approved Quotation</label>
              <Select value={selectedQuotation} onValueChange={setSelectedQuotation}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quotation" />
                </SelectTrigger>
                <SelectContent>
                  {approvedQuotations.map((quotation) => (
                    <SelectItem key={quotation.id} value={quotation.id}>
                      {quotation.quotation_number} - {quotation.customer_name} - AED {quotation.total_amount.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={submitting}>
                Cancel
              </Button>
              <Button onClick={handleConvertToSO} disabled={submitting || !selectedQuotation}>
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Converting...
                  </>
                ) : (
                  'Convert to SO'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stock Check Results Dialog */}
      <Dialog open={stockCheckDialogOpen} onOpenChange={setStockCheckDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Stock Availability Check</DialogTitle>
            <DialogDescription>
              {selectedOrder?.so_number} - Stock availability results
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {stockCheckResults.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipment</TableHead>
                    <TableHead>Ordered</TableHead>
                    <TableHead>Available</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stockCheckResults.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.equipment_type}</TableCell>
                      <TableCell>{item.quantity_ordered}</TableCell>
                      <TableCell>{item.quantity_available}</TableCell>
                      <TableCell>
                        <Badge variant={item.is_available ? 'default' : 'destructive'}>
                          {item.is_available ? 'Available' : 'Insufficient Stock'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">Loading stock information...</p>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setStockCheckDialogOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sales Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
          <CardDescription>Track and manage sales orders from quotation to contract</CardDescription>
        </CardHeader>
        <CardContent>
          {salesOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No sales orders found</p>
              <p className="text-sm text-muted-foreground mt-2">Convert an approved quotation to create a sales order</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SO #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Deposit</TableHead>
                  <TableHead>Stock Status</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salesOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.so_number}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-muted-foreground">{order.customer_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{order.project_name || 'N/A'}</p>
                        <p className="text-muted-foreground">{order.site_location}</p>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">AED {order.total_amount.toFixed(2)}</TableCell>
                    <TableCell>AED {order.deposit_amount.toFixed(2)}</TableCell>
                    <TableCell>{getStockStatusBadge(order.stock_check_status)}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-sm">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        {order.stock_check_status === 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCheckStock(order)}
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Check Stock
                          </Button>
                        )}
                        {order.status === 'draft' && order.stock_check_status !== 'pending' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSendForApproval(order.id)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Send for Approval
                          </Button>
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
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOrders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOrders.filter(so => so.stock_check_status === 'available').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesOrders.filter(so => so.status === 'pending_approval').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              AED {salesOrders.reduce((sum, so) => sum + so.total_amount, 0).toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SalesOrderManagementModule;