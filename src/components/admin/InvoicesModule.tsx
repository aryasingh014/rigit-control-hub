import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Download, FileText, Send, CreditCard } from 'lucide-react';

const invoicesData = [
  { id: 'INV-2025-001', contractId: 'RC-2025-001', customer: 'ABC Construction LLC', date: '2025-01-15', amount: 11905, vat: 595, total: 12500, status: 'paid', dueDate: '2025-01-30', currency: 'AED', vatRate: 5 },
  { id: 'INV-2025-002', contractId: 'RC-2025-002', customer: 'XYZ Builders', date: '2025-02-01', amount: 8476, vat: 424, total: 8900, status: 'pending', dueDate: '2025-02-15', currency: 'AED', vatRate: 5 },
  { id: 'INV-2025-003', contractId: 'RC-2025-003', customer: 'Elite Construction', date: '2025-01-20', amount: 14476, vat: 724, total: 15200, status: 'overdue', dueDate: '2025-02-04', currency: 'USD', vatRate: 0 },
  { id: 'INV-2025-004', contractId: 'RC-2025-004', customer: 'Modern Builders', date: '2025-03-01', amount: 6429, vat: 321, total: 6750, status: 'paid', dueDate: '2025-03-15', currency: 'AED', vatRate: 5 },
];

export const InvoicesModule = () => {
  const [invoices, setInvoices] = useState(invoicesData);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contractId: '', customer: '', amount: '', currency: 'AED', vatRate: '5', dueDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.amount);
    const vatRate = parseFloat(formData.vatRate);
    const vat = formData.currency === 'AED' ? amount * (vatRate / 100) : 0; // VAT only for AED
    const total = amount + vat;
    // Here you would typically save to database
    console.log('Creating invoice:', { ...formData, vat, total });
    const newInvoice = {
      id: `INV-2025-${(invoices.length + 1).toString().padStart(3, '0')}`,
      contractId: formData.contractId,
      customer: formData.customer,
      date: new Date().toISOString().split('T')[0],
      amount: amount,
      vat: vat,
      total: total,
      status: 'pending',
      dueDate: formData.dueDate,
      currency: formData.currency,
      vatRate: vatRate
    };
    setInvoices([...invoices, newInvoice]);
    toast({
      title: 'Invoice Created',
      description: `Invoice for ${formData.customer} has been created successfully.`,
    });
    setOpen(false);
    setFormData({ contractId: '', customer: '', amount: '', currency: 'AED', vatRate: '5', dueDate: '' });
  };

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInvoices(invoices.map(i => i.id === editingInvoice.id ? editingInvoice : i));
    toast({
      title: 'Invoice Updated',
      description: `${editingInvoice.id} has been updated successfully.`,
    });
    setEditDialogOpen(false);
    setEditingInvoice(null);
  };

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id));
    toast({
      title: 'Invoice Deleted',
      description: `${id} has been removed.`,
    });
  };

  const handleDownload = (id: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading PDF for ${id}`,
    });
  };

  const handleSendInvoice = (id: string) => {
    toast({
      title: 'Invoice Sent',
      description: `Invoice ${id} has been sent to customer.`,
    });
  };

  const handleRecordPayment = (id: string) => {
    toast({
      title: 'Payment Recorded',
      description: `Payment for invoice ${id} has been recorded.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
      cancelled: 'outline',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Invoices Management</h3>
          <p className="text-sm text-muted-foreground">Create, manage, and track invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>Generate invoice for contract</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractId">Contract ID</Label>
                  <Input id="contractId" value={formData.contractId} onChange={(e) => setFormData({ ...formData, contractId: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val, vatRate: val === 'AED' ? '5' : '0' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AED">AED</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EURO">EURO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatRate">VAT Rate (%)</Label>
                  <Input id="vatRate" type="number" value={formData.vatRate} onChange={(e) => setFormData({ ...formData, vatRate: e.target.value })} required disabled={formData.currency !== 'AED'} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Generate Invoice</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Invoice</DialogTitle>
            <DialogDescription>Update invoice details</DialogDescription>
          </DialogHeader>
          {editingInvoice && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-contractId">Contract ID</Label>
                  <Input id="edit-contractId" value={editingInvoice.contractId} onChange={(e) => setEditingInvoice({ ...editingInvoice, contractId: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-customer">Customer</Label>
                  <Input id="edit-customer" value={editingInvoice.customer} onChange={(e) => setEditingInvoice({ ...editingInvoice, customer: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Amount (AED)</Label>
                  <Input id="edit-amount" type="number" value={editingInvoice.amount} onChange={(e) => setEditingInvoice({ ...editingInvoice, amount: parseInt(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vat">VAT (AED)</Label>
                  <Input id="edit-vat" type="number" value={editingInvoice.vat} onChange={(e) => setEditingInvoice({ ...editingInvoice, vat: parseInt(e.target.value) })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dueDate">Due Date</Label>
                  <Input id="edit-dueDate" type="date" value={editingInvoice.dueDate} onChange={(e) => setEditingInvoice({ ...editingInvoice, dueDate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingInvoice.status} onValueChange={(val) => setEditingInvoice({ ...editingInvoice, status: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Invoice</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead>VAT</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.contractId}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell className="text-sm">{invoice.date}</TableCell>
                <TableCell>{invoice.currency} {invoice.amount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">{invoice.currency}</TableCell>
                <TableCell className="text-muted-foreground">{invoice.currency} {invoice.vat}</TableCell>
                <TableCell className="font-semibold">{invoice.currency} {invoice.total.toLocaleString()}</TableCell>
                <TableCell className="text-sm">{invoice.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleSendInvoice(invoice.id)}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleRecordPayment(invoice.id)}>
                    <CreditCard className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleDownload(invoice.id)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(invoice)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice.id)}>
                    <Trash2 className="h-4 w-4" />
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