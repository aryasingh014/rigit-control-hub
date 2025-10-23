import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, Receipt, DollarSign } from 'lucide-react';

const paymentsData = [
  { id: 'PAY-2025-023', invoice: 'VI-2025-023', amount: '$8,200', date: 'Oct 20, 2025', method: 'Bank Transfer', status: 'received' },
  { id: 'PAY-2025-022', invoice: 'VI-2025-022', amount: '$6,750', date: 'Oct 15, 2025', method: 'Bank Transfer', status: 'received' },
  { id: 'PAY-2025-021', invoice: 'VI-2025-021', amount: '$9,500', date: 'Oct 10, 2025', method: 'Cheque', status: 'received' },
  { id: 'PAY-2025-020', invoice: 'VI-2025-020', amount: '$7,200', date: 'Oct 5, 2025', method: 'Bank Transfer', status: 'received' },
];

export const VendorPaymentsModule = () => {
  const [payments, setPayments] = useState(paymentsData);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingPayment, setViewingPayment] = useState<any>(null);
  const { toast } = useToast();

  const handleView = (payment: any) => {
    setViewingPayment(payment);
    setViewDialogOpen(true);
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      received: 'default',
      pending: 'secondary',
      failed: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const totalReceived = payments
    .filter(p => p.status === 'received')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('$', '').replace(',', '')), 0);

  const pendingPayments = payments.filter(p => p.status === 'pending').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Payment History</h3>
          <p className="text-sm text-muted-foreground">Track payments received for your work</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Received</p>
              <p className="text-2xl font-bold text-success">${totalReceived.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-success" />
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Payments Count</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
            <Receipt className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-warning">{pendingPayments}</p>
            </div>
            <Receipt className="h-8 w-8 text-warning" />
          </div>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>Complete payment information</DialogDescription>
          </DialogHeader>
          {viewingPayment && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment ID</Label>
                  <p className="text-sm text-muted-foreground">{viewingPayment.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Invoice ID</Label>
                  <p className="text-sm text-muted-foreground">{viewingPayment.invoice}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground font-semibold">{viewingPayment.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusBadgeVariant(viewingPayment.status)}>
                    {viewingPayment.status}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Payment Method</Label>
                  <p className="text-sm text-muted-foreground">{viewingPayment.method}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm text-muted-foreground">{viewingPayment.date}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Payment ID</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">{payment.id}</TableCell>
                <TableCell>{payment.invoice}</TableCell>
                <TableCell className="font-semibold text-success">{payment.amount}</TableCell>
                <TableCell>{payment.method}</TableCell>
                <TableCell className="text-sm">{payment.date}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(payment.status)}>
                    {payment.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleView(payment)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};