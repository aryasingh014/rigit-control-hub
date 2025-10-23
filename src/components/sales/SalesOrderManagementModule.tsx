import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ShoppingCart, CheckCircle, AlertTriangle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SalesOrder {
  id: string;
  quotationId: string;
  customerName: string;
  company: string;
  project: string;
  equipment: string[];
  totalAmount: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'processing' | 'completed';
  createdDate: string;
  stockChecked: boolean;
  stockAvailable: boolean;
  notes: string;
}

const SalesOrderManagementModule = () => {
  const { toast } = useToast();
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>([
    {
      id: 'SO-2025-001',
      quotationId: 'QT-2025-002',
      customerName: 'Sarah Johnson',
      company: 'XYZ Builders',
      project: 'Residential Complex',
      equipment: ['Safety Barriers', 'Safety Nets'],
      totalAmount: 690,
      status: 'approved',
      createdDate: '2025-10-19',
      stockChecked: true,
      stockAvailable: true,
      notes: 'Ready for dispatch'
    },
    {
      id: 'SO-2025-002',
      quotationId: 'QT-2025-001',
      customerName: 'John Smith',
      company: 'ABC Construction LLC',
      project: 'Skyline Tower',
      equipment: ['Scaffolding Platform'],
      totalAmount: 1425,
      status: 'pending_approval',
      createdDate: '2025-10-21',
      stockChecked: false,
      stockAvailable: false,
      notes: 'Awaiting stock verification'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState('');
  const [stockCheckResults, setStockCheckResults] = useState<{[key: string]: boolean}>({});

  // Mock quotations data - in real app this would come from API
  const availableQuotations = [
    { id: 'QT-2025-001', customer: 'John Smith', project: 'Skyline Tower', amount: 1425, status: 'approved' },
    { id: 'QT-2025-002', customer: 'Sarah Johnson', project: 'Residential Complex', amount: 690, status: 'approved' }
  ];

  const handleCreateSO = () => {
    if (!selectedQuotation) {
      toast({
        title: 'Error',
        description: 'Please select a quotation to convert',
        variant: 'destructive'
      });
      return;
    }

    const quotation = availableQuotations.find(q => q.id === selectedQuotation);
    if (!quotation) return;

    const salesOrder: SalesOrder = {
      id: `SO-2025-${String(salesOrders.length + 1).padStart(3, '0')}`,
      quotationId: quotation.id,
      customerName: quotation.customer,
      company: 'Company Name', // Would be fetched from quotation data
      project: quotation.project,
      equipment: ['Equipment Item'], // Would be fetched from quotation data
      totalAmount: quotation.amount,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      stockChecked: false,
      stockAvailable: false,
      notes: ''
    };

    setSalesOrders([salesOrder, ...salesOrders]);
    setSelectedQuotation('');
    setIsCreateDialogOpen(false);
    toast({
      title: 'Success',
      description: 'Sales Order created successfully'
    });
  };

  const handleCheckStock = (orderId: string) => {
    // Mock stock checking - in real app this would call warehouse API
    const isAvailable = Math.random() > 0.3; // 70% chance of availability
    setStockCheckResults({...stockCheckResults, [orderId]: isAvailable});

    setSalesOrders(salesOrders.map(order =>
      order.id === orderId
        ? { ...order, stockChecked: true, stockAvailable: isAvailable }
        : order
    ));

    toast({
      title: 'Stock Check Complete',
      description: isAvailable ? 'All items are in stock' : 'Some items are out of stock',
      variant: isAvailable ? 'default' : 'destructive'
    });
  };

  const handleSendForApproval = (order: SalesOrder) => {
    if (!order.stockChecked) {
      toast({
        title: 'Stock Check Required',
        description: 'Please check stock availability before sending for approval',
        variant: 'destructive'
      });
      return;
    }

    setSalesOrders(salesOrders.map(o =>
      o.id === order.id ? { ...o, status: 'pending_approval' as const } : o
    ));

    toast({
      title: 'Sent for Approval',
      description: `Sales Order ${order.id} sent for approval`
    });
  };

  const getStatusColor = (status: SalesOrder['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'pending_approval': return 'default';
      case 'approved': return 'default';
      case 'processing': return 'default';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: SalesOrder['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending_approval': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Sales Order Management</h3>
          <p className="text-sm text-muted-foreground">Convert approved quotations to sales orders and manage fulfillment</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create SO
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Sales Order</DialogTitle>
              <DialogDescription>
                Convert an approved quotation into a sales order
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="quotation">Select Approved Quotation *</Label>
                <Select value={selectedQuotation} onValueChange={setSelectedQuotation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a quotation" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableQuotations
                      .filter(q => q.status === 'approved')
                      .map((quotation) => (
                        <SelectItem key={quotation.id} value={quotation.id}>
                          {quotation.id} - {quotation.customer} - {quotation.project} (${quotation.amount})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateSO}>
                Create Sales Order
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales Orders</CardTitle>
          <CardDescription>Track sales orders from creation to fulfillment</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SO ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customerName}</p>
                      <p className="text-sm text-muted-foreground">{order.company}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.project}</TableCell>
                  <TableCell className="font-semibold">${order.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {order.stockChecked ? (
                        <Badge variant={order.stockAvailable ? 'default' : 'destructive'}>
                          {order.stockAvailable ? 'In Stock' : 'Out of Stock'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Not Checked</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <Badge variant={getStatusColor(order.status)}>
                        {order.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {!order.stockChecked && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckStock(order.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Check Stock
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendForApproval(order)}
                        disabled={!order.stockChecked || order.status !== 'draft'}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send for Approval
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesOrderManagementModule;