import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, FileText, CheckCircle, XCircle, Calendar, AlertTriangle } from 'lucide-react';

const contractsData = [
  { id: 'RC-2025-001', customer: 'ABC Construction LLC', project: 'Downtown Tower', equipment: 'Scaffolding Set (Complete)', startDate: '2025-01-15', endDate: '2025-03-15', status: 'active', amount: 12500, renewalDate: '2025-03-10', approvalStatus: 'approved' },
  { id: 'RC-2025-002', customer: 'XYZ Builders', project: 'Residential Complex', equipment: 'Safety Equipment Bundle', startDate: '2025-02-01', endDate: '2025-04-01', status: 'active', amount: 8900, renewalDate: '2025-03-25', approvalStatus: 'approved' },
  { id: 'RC-2025-003', customer: 'Elite Construction', project: 'Office Building', equipment: 'Mobile Platforms (x3)', startDate: '2025-01-20', endDate: '2025-02-20', status: 'completed', amount: 15200, renewalDate: null, approvalStatus: 'approved' },
  { id: 'RC-2025-004', customer: 'Modern Builders', project: 'Mall Extension', equipment: 'Formwork Panels', startDate: '2025-03-01', endDate: '2025-05-01', status: 'pending', amount: 6750, renewalDate: '2025-04-25', approvalStatus: 'pending' },
];

export const ContractsModule = () => {
  const [contracts, setContracts] = useState(contractsData);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<any>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customer: '', project: '', equipment: '', startDate: '', endDate: '', amount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to database
    console.log('Creating contract:', formData);
    const newContract = {
      id: `RC-2025-${(contracts.length + 1).toString().padStart(3, '0')}`,
      customer: formData.customer,
      project: formData.project,
      equipment: formData.equipment,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: 'pending',
      amount: parseInt(formData.amount),
      renewalDate: null,
      approvalStatus: 'pending'
    };
    setContracts([...contracts, newContract]);
    toast({
      title: 'Contract Created',
      description: `Contract for ${formData.customer} has been created successfully.`,
    });
    setOpen(false);
    setFormData({ customer: '', project: '', equipment: '', startDate: '', endDate: '', amount: '' });
  };

  const handleEdit = (contract: any) => {
    setEditingContract(contract);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContracts(contracts.map(c => c.id === editingContract.id ? editingContract : c));
    toast({
      title: 'Contract Updated',
      description: `${editingContract.id} has been updated successfully.`,
    });
    setEditDialogOpen(false);
    setEditingContract(null);
  };

  const handleDelete = (id: string) => {
    setContracts(contracts.filter(c => c.id !== id));
    toast({
      title: 'Contract Deleted',
      description: `${id} has been removed.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      active: 'default',
      completed: 'secondary',
      pending: 'outline',
      cancelled: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const getApprovalBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      approved: 'default',
      pending: 'outline',
      rejected: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const handleApproveContract = (contract: any) => {
    const updatedContract = { ...contract, approvalStatus: 'approved', status: 'active' };
    setContracts(contracts.map(c => c.id === contract.id ? updatedContract : c));
    toast({
      title: 'Contract Approved',
      description: `${contract.id} has been approved and activated.`,
    });
  };

  const handleRejectContract = (contract: any) => {
    const updatedContract = { ...contract, approvalStatus: 'rejected', status: 'cancelled' };
    setContracts(contracts.map(c => c.id === contract.id ? updatedContract : c));
    toast({
      title: 'Contract Rejected',
      description: `${contract.id} has been rejected.`,
    });
  };

  const isRenewalDue = (renewalDate: string | null) => {
    if (!renewalDate) return false;
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays >= 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Contract Oversight</h3>
          <p className="text-sm text-muted-foreground">Approve/reject contracts, monitor renewals, and track contract lifecycle</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Contract
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>Enter contract details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer</Label>
                  <Input id="customer" value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Input id="project" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment</Label>
                <Input id="equipment" value={formData.equipment} onChange={(e) => setFormData({ ...formData, equipment: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Contract Amount (AED)</Label>
                <Input id="amount" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Create Contract</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Contract</DialogTitle>
            <DialogDescription>Update contract details</DialogDescription>
          </DialogHeader>
          {editingContract && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-customer">Customer</Label>
                  <Input id="edit-customer" value={editingContract.customer} onChange={(e) => setEditingContract({ ...editingContract, customer: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-project">Project</Label>
                  <Input id="edit-project" value={editingContract.project} onChange={(e) => setEditingContract({ ...editingContract, project: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-equipment">Equipment</Label>
                <Input id="edit-equipment" value={editingContract.equipment} onChange={(e) => setEditingContract({ ...editingContract, equipment: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Start Date</Label>
                  <Input id="edit-startDate" type="date" value={editingContract.startDate} onChange={(e) => setEditingContract({ ...editingContract, startDate: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">End Date</Label>
                  <Input id="edit-endDate" type="date" value={editingContract.endDate} onChange={(e) => setEditingContract({ ...editingContract, endDate: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-amount">Contract Amount (AED)</Label>
                  <Input id="edit-amount" type="number" value={editingContract.amount} onChange={(e) => setEditingContract({ ...editingContract, amount: parseInt(e.target.value) })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editingContract.status} onValueChange={(val) => setEditingContract({ ...editingContract, status: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Contract</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Equipment</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Renewal</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.id}</TableCell>
                <TableCell>{contract.customer}</TableCell>
                <TableCell>{contract.project}</TableCell>
                <TableCell className="text-sm">{contract.equipment}</TableCell>
                <TableCell className="text-sm">{contract.startDate}</TableCell>
                <TableCell className="text-sm">{contract.endDate}</TableCell>
                <TableCell>
                  {contract.renewalDate ? (
                    <div className="flex items-center gap-1">
                      {isRenewalDue(contract.renewalDate) && <AlertTriangle className="h-3 w-3 text-orange-500" />}
                      <span className={`text-sm ${isRenewalDue(contract.renewalDate) ? 'text-orange-600 font-medium' : ''}`}>
                        {contract.renewalDate}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="font-semibold">AED {contract.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getApprovalBadgeVariant(contract.approvalStatus)}>
                    {contract.approvalStatus}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(contract.status)}>
                    {contract.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {contract.approvalStatus === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" title="Approve Contract" onClick={() => handleApproveContract(contract)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reject Contract" onClick={() => handleRejectContract(contract)}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" title="Edit Contract" onClick={() => handleEdit(contract)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete Contract" onClick={() => handleDelete(contract.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};