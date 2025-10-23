import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const customerData = [
  { id: '1', name: 'ABC Construction LLC', email: 'info@abcconstruction.ae', phone: '+971-4-123-4567', crNumber: 'CR-12345', vatNumber: 'VAT-67890', creditLimit: 50000, depositAmount: 10000 },
  { id: '2', name: 'Dubai Builders Co.', email: 'contact@dubaibuilders.ae', phone: '+971-4-234-5678', crNumber: 'CR-23456', vatNumber: 'VAT-78901', creditLimit: 75000, depositAmount: 15000 },
  { id: '3', name: 'Emirates Projects Ltd', email: 'info@emiratesprojects.ae', phone: '+971-4-345-6789', crNumber: 'CR-34567', vatNumber: 'VAT-89012', creditLimit: 100000, depositAmount: 20000 },
];

export const CustomerModule = () => {
  const [customers, setCustomers] = useState(customerData);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', crNumber: '', vatNumber: '', creditLimit: '', depositAmount: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save to database
    console.log('Adding customer:', formData);
    const newCustomer = {
      id: (customers.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      crNumber: formData.crNumber,
      vatNumber: formData.vatNumber,
      creditLimit: parseInt(formData.creditLimit),
      depositAmount: parseInt(formData.depositAmount)
    };
    setCustomers([...customers, newCustomer]);
    toast({
      title: 'Customer Added',
      description: `${formData.name} has been added successfully.`,
    });
    setOpen(false);
    setFormData({ name: '', email: '', phone: '', crNumber: '', vatNumber: '', creditLimit: '', depositAmount: '' });
  };

  const handleEdit = (customer: any) => {
    setEditingCustomer(customer);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers(customers.map(c => c.id === editingCustomer.id ? editingCustomer : c));
    toast({
      title: 'Customer Updated',
      description: `${editingCustomer.name} has been updated successfully.`,
    });
    setEditDialogOpen(false);
    setEditingCustomer(null);
  };

  const handleDelete = (id: string, name: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast({
      title: 'Customer Deleted',
      description: `${name} has been removed.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer Management</h3>
          <p className="text-sm text-muted-foreground">Manage customer accounts and credit limits</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>Enter customer details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name</Label>
                  <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="crNumber">CR Number</Label>
                  <Input id="crNumber" value={formData.crNumber} onChange={(e) => setFormData({ ...formData, crNumber: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">VAT Number</Label>
                  <Input id="vatNumber" value={formData.vatNumber} onChange={(e) => setFormData({ ...formData, vatNumber: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Credit Limit (AED)</Label>
                  <Input id="creditLimit" type="number" value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="depositAmount">Deposit Amount (AED)</Label>
                <Input id="depositAmount" type="number" value={formData.depositAmount} onChange={(e) => setFormData({ ...formData, depositAmount: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Add Customer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Customer</DialogTitle>
              <DialogDescription>Update customer details</DialogDescription>
            </DialogHeader>
            {editingCustomer && (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Company Name</Label>
                    <Input id="edit-name" value={editingCustomer.name} onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" type="email" value={editingCustomer.email} onChange={(e) => setEditingCustomer({ ...editingCustomer, email: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" value={editingCustomer.phone} onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-crNumber">CR Number</Label>
                    <Input id="edit-crNumber" value={editingCustomer.crNumber} onChange={(e) => setEditingCustomer({ ...editingCustomer, crNumber: e.target.value })} required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-vatNumber">VAT Number</Label>
                    <Input id="edit-vatNumber" value={editingCustomer.vatNumber} onChange={(e) => setEditingCustomer({ ...editingCustomer, vatNumber: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-creditLimit">Credit Limit (AED)</Label>
                    <Input id="edit-creditLimit" type="number" value={editingCustomer.creditLimit} onChange={(e) => setEditingCustomer({ ...editingCustomer, creditLimit: parseInt(e.target.value) })} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-depositAmount">Deposit Amount (AED)</Label>
                  <Input id="edit-depositAmount" type="number" value={editingCustomer.depositAmount} onChange={(e) => setEditingCustomer({ ...editingCustomer, depositAmount: parseInt(e.target.value) })} required />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                  <Button type="submit">Update Customer</Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>CR Number</TableHead>
              <TableHead>Credit Limit</TableHead>
              <TableHead>Deposit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.crNumber}</TableCell>
                <TableCell>AED {customer.creditLimit.toLocaleString()}</TableCell>
                <TableCell>AED {customer.depositAmount.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id, customer.name)}>
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
