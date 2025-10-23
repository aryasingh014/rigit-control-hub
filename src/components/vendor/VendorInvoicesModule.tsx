import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, Download, Eye, FileText } from 'lucide-react';

const invoicesData = [
  { id: 'VI-2025-023', workOrder: 'WO-2025-044', amount: '$8,200', status: 'approved', submittedDate: 'Oct 15, 2025', approvedDate: 'Oct 18, 2025' },
  { id: 'VI-2025-024', workOrder: 'WO-2025-045', amount: '$7,500', status: 'pending', submittedDate: 'Oct 20, 2025', approvedDate: null },
  { id: 'VI-2025-025', workOrder: 'WO-2025-046', amount: '$8,900', status: 'under_review', submittedDate: 'Oct 22, 2025', approvedDate: null },
];

export const VendorInvoicesModule = () => {
  const [invoices, setInvoices] = useState(invoicesData);
  const [open, setOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<any>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    workOrderId: '', amount: '', description: '', attachments: null as FileList | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInvoice = {
      id: `VI-2025-${(invoices.length + 26).toString().padStart(3, '0')}`,
      workOrder: formData.workOrderId,
      amount: `$${parseFloat(formData.amount).toLocaleString()}`,
      status: 'pending',
      submittedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      approvedDate: null
    };
    setInvoices([...invoices, newInvoice]);
    toast({
      title: 'Invoice Submitted',
      description: `Invoice for ${formData.workOrderId} has been submitted successfully.`,
    });
    setOpen(false);
    setFormData({ workOrderId: '', amount: '', description: '', attachments: null });
  };

  const handleView = (invoice: any) => {
    setViewingInvoice(invoice);
    setViewDialogOpen(true);
  };

  const handleDownload = (id: string) => {
    toast({
      title: 'Download Started',
      description: `Downloading PDF for ${id}`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      approved: 'default',
      pending: 'secondary',
      under_review: 'outline',
      rejected: 'destructive',
    };
    return variants[status] || 'outline';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Invoice Management</h3>
          <p className="text-sm text-muted-foreground">Submit and track your invoices</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Submit Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit New Invoice</DialogTitle>
              <DialogDescription>Submit an invoice for completed work</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workOrderId">Work Order ID</Label>
                  <Input id="workOrderId" value={formData.workOrderId} onChange={(e) => setFormData({ ...formData, workOrderId: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (AED)</Label>
                  <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Work Description</Label>
                <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attachments">Attachments</Label>
                <Input id="attachments" type="file" multiple onChange={(e) => setFormData({ ...formData, attachments: e.target.files })} />
                <p className="text-xs text-muted-foreground">Upload supporting documents (invoices, receipts, etc.)</p>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Submit Invoice</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>Complete invoice information</DialogDescription>
          </DialogHeader>
          {viewingInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Invoice ID</Label>
                  <p className="text-sm text-muted-foreground">{viewingInvoice.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Work Order</Label>
                  <p className="text-sm text-muted-foreground">{viewingInvoice.workOrder}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Amount</Label>
                  <p className="text-sm text-muted-foreground font-semibold">{viewingInvoice.amount}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusBadgeVariant(viewingInvoice.status)}>
                    {viewingInvoice.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Submitted Date</Label>
                  <p className="text-sm text-muted-foreground">{viewingInvoice.submittedDate}</p>
                </div>
                {viewingInvoice.approvedDate && (
                  <div>
                    <Label className="text-sm font-medium">Approved Date</Label>
                    <p className="text-sm text-muted-foreground">{viewingInvoice.approvedDate}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Work Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.id}</TableCell>
                <TableCell>{invoice.workOrder}</TableCell>
                <TableCell className="font-semibold">{invoice.amount}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(invoice.status)}>
                    {invoice.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{invoice.submittedDate}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleView(invoice)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  {invoice.status === 'approved' && (
                    <Button variant="ghost" size="icon" onClick={() => handleDownload(invoice.id)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};