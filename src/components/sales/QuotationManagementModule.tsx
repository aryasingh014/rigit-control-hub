import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Download, Send, Edit, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QuotationItem {
  id: string;
  equipment: string;
  length: number;
  breadth: number;
  sqft: number;
  ratePerSqft: number;
  subtotal: number;
  wastageCharges: number;
  cuttingCharges: number;
  total: number;
}

interface Quotation {
  id: string;
  customerName: string;
  company: string;
  project: string;
  items: QuotationItem[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  createdDate: string;
  validUntil: string;
  notes: string;
}

const QuotationManagementModule = () => {
  const { toast } = useToast();
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: 'QT-2025-001',
      customerName: 'John Smith',
      company: 'ABC Construction LLC',
      project: 'Skyline Tower',
      items: [
        {
          id: '1',
          equipment: 'Scaffolding Platform',
          length: 10,
          breadth: 5,
          sqft: 50,
          ratePerSqft: 25,
          subtotal: 1250,
          wastageCharges: 125,
          cuttingCharges: 50,
          total: 1425
        }
      ],
      totalAmount: 1425,
      status: 'sent',
      createdDate: '2025-10-20',
      validUntil: '2025-10-30',
      notes: 'Includes delivery and setup'
    },
    {
      id: 'QT-2025-002',
      customerName: 'Sarah Johnson',
      company: 'XYZ Builders',
      project: 'Residential Complex',
      items: [
        {
          id: '2',
          equipment: 'Safety Barriers',
          length: 20,
          breadth: 2,
          sqft: 40,
          ratePerSqft: 15,
          subtotal: 600,
          wastageCharges: 60,
          cuttingCharges: 30,
          total: 690
        }
      ],
      totalAmount: 690,
      status: 'approved',
      createdDate: '2025-10-18',
      validUntil: '2025-10-28',
      notes: 'Safety equipment package'
    }
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newQuotation, setNewQuotation] = useState({
    customerName: '',
    company: '',
    project: '',
    notes: ''
  });

  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [newItem, setNewItem] = useState({
    equipment: '',
    length: 0,
    breadth: 0,
    ratePerSqft: 0,
    wastageCharges: 0,
    cuttingCharges: 0
  });

  const calculateSqft = (length: number, breadth: number) => length * breadth;
  const calculateSubtotal = (sqft: number, rate: number) => sqft * rate;
  const calculateTotal = (subtotal: number, wastage: number, cutting: number) => subtotal + wastage + cutting;

  const handleAddItem = () => {
    if (!newItem.equipment || newItem.length <= 0 || newItem.breadth <= 0 || newItem.ratePerSqft <= 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required item fields',
        variant: 'destructive'
      });
      return;
    }

    const sqft = calculateSqft(newItem.length, newItem.breadth);
    const subtotal = calculateSubtotal(sqft, newItem.ratePerSqft);
    const total = calculateTotal(subtotal, newItem.wastageCharges, newItem.cuttingCharges);

    const item: QuotationItem = {
      id: String(quotationItems.length + 1),
      ...newItem,
      sqft,
      subtotal,
      total
    };

    setQuotationItems([...quotationItems, item]);
    setNewItem({
      equipment: '',
      length: 0,
      breadth: 0,
      ratePerSqft: 0,
      wastageCharges: 0,
      cuttingCharges: 0
    });
  };

  const handleCreateQuotation = () => {
    if (!newQuotation.customerName || !newQuotation.company || !newQuotation.project || quotationItems.length === 0) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields and add at least one item',
        variant: 'destructive'
      });
      return;
    }

    const totalAmount = quotationItems.reduce((sum, item) => sum + item.total, 0);
    const quotation: Quotation = {
      id: `QT-2025-${String(quotations.length + 1).padStart(3, '0')}`,
      ...newQuotation,
      items: quotationItems,
      totalAmount,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 10 days from now
    };

    setQuotations([quotation, ...quotations]);
    setNewQuotation({
      customerName: '',
      company: '',
      project: '',
      notes: ''
    });
    setQuotationItems([]);
    setIsCreateDialogOpen(false);
    toast({
      title: 'Success',
      description: 'Quotation created successfully'
    });
  };

  const handleGeneratePDF = (quotation: Quotation) => {
    toast({
      title: 'Generate PDF',
      description: `Generating PDF for quotation ${quotation.id}`
    });
  };

  const handleSendQuotation = (quotation: Quotation) => {
    setQuotations(quotations.map(q =>
      q.id === quotation.id ? { ...q, status: 'sent' as const } : q
    ));
    toast({
      title: 'Quotation Sent',
      description: `Quotation ${quotation.id} sent to ${quotation.customerName}`
    });
  };

  const handleEditQuotation = (quotation: Quotation) => {
    toast({
      title: 'Edit Quotation',
      description: `Editing quotation ${quotation.id}`
    });
  };

  const getStatusColor = (status: Quotation['status']) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quotation Management</h3>
          <p className="text-sm text-muted-foreground">Create and manage quotations with detailed pricing</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Quotation</DialogTitle>
              <DialogDescription>
                Create a detailed quotation with equipment dimensions and pricing
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={newQuotation.customerName}
                    onChange={(e) => setNewQuotation({...newQuotation, customerName: e.target.value})}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={newQuotation.company}
                    onChange={(e) => setNewQuotation({...newQuotation, company: e.target.value})}
                    placeholder="ABC Construction LLC"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="project">Project Name *</Label>
                <Input
                  id="project"
                  value={newQuotation.project}
                  onChange={(e) => setNewQuotation({...newQuotation, project: e.target.value})}
                  placeholder="Skyline Tower"
                />
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-4">Add Equipment Items</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="equipment">Equipment *</Label>
                    <Input
                      id="equipment"
                      value={newItem.equipment}
                      onChange={(e) => setNewItem({...newItem, equipment: e.target.value})}
                      placeholder="Scaffolding Platform"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length (ft) *</Label>
                      <Input
                        id="length"
                        type="number"
                        value={newItem.length || ''}
                        onChange={(e) => setNewItem({...newItem, length: Number(e.target.value)})}
                        placeholder="10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="breadth">Breadth (ft) *</Label>
                      <Input
                        id="breadth"
                        type="number"
                        value={newItem.breadth || ''}
                        onChange={(e) => setNewItem({...newItem, breadth: Number(e.target.value)})}
                        placeholder="5"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="ratePerSqft">Rate per Sqft *</Label>
                    <Input
                      id="ratePerSqft"
                      type="number"
                      value={newItem.ratePerSqft || ''}
                      onChange={(e) => setNewItem({...newItem, ratePerSqft: Number(e.target.value)})}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="wastageCharges">Wastage Charges</Label>
                    <Input
                      id="wastageCharges"
                      type="number"
                      value={newItem.wastageCharges || ''}
                      onChange={(e) => setNewItem({...newItem, wastageCharges: Number(e.target.value)})}
                      placeholder="125"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cuttingCharges">Cutting Charges</Label>
                    <Input
                      id="cuttingCharges"
                      type="number"
                      value={newItem.cuttingCharges || ''}
                      onChange={(e) => setNewItem({...newItem, cuttingCharges: Number(e.target.value)})}
                      placeholder="50"
                    />
                  </div>
                </div>
                <Button onClick={handleAddItem} className="mb-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>

                {quotationItems.length > 0 && (
                  <div className="border rounded-lg p-4 mb-4">
                    <h5 className="font-medium mb-2">Items Added:</h5>
                    <div className="space-y-2">
                      {quotationItems.map((item, index) => (
                        <div key={index} className="text-sm border-b pb-2">
                          <p><strong>{item.equipment}</strong></p>
                          <p>Dimensions: {item.length}ft x {item.breadth}ft = {item.sqft} sqft</p>
                          <p>Rate: ${item.ratePerSqft}/sqft, Subtotal: ${item.subtotal}</p>
                          <p>Wastage: ${item.wastageCharges}, Cutting: ${item.cuttingCharges}</p>
                          <p className="font-medium">Total: ${item.total}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newQuotation.notes}
                  onChange={(e) => setNewQuotation({...newQuotation, notes: e.target.value})}
                  placeholder="Additional terms or notes"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateQuotation}>
                Create Quotation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quotation List</CardTitle>
          <CardDescription>Manage quotations and track their approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quote ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotations.map((quotation) => (
                <TableRow key={quotation.id}>
                  <TableCell className="font-medium">{quotation.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{quotation.customerName}</p>
                      <p className="text-sm text-muted-foreground">{quotation.company}</p>
                    </div>
                  </TableCell>
                  <TableCell>{quotation.project}</TableCell>
                  <TableCell className="font-semibold">${quotation.totalAmount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(quotation.status)}>
                      {quotation.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{quotation.validUntil}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGeneratePDF(quotation)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSendQuotation(quotation)}
                        disabled={quotation.status !== 'draft'}
                      >
                        <Send className="h-3 w-3 mr-1" />
                        Send
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditQuotation(quotation)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
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

export default QuotationManagementModule;