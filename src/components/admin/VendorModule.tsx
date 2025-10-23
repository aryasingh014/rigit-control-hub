import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2 } from 'lucide-react';

const vendorData = [
  { id: '1', name: 'Steel Supplies LLC', email: 'sales@steelsupplies.ae', phone: '+971-4-111-2222', crNumber: 'CR-98765', tradeLicense: 'TL-11111', address: 'Industrial Area 1, Dubai' },
  { id: '2', name: 'Aluminum Trading Co.', email: 'info@aluminumtrading.ae', phone: '+971-4-222-3333', crNumber: 'CR-87654', tradeLicense: 'TL-22222', address: 'Jebel Ali, Dubai' },
  { id: '3', name: 'Safety Equipment LLC', email: 'contact@safetyequip.ae', phone: '+971-4-333-4444', crNumber: 'CR-76543', tradeLicense: 'TL-33333', address: 'Sharjah Industrial Area' },
];

export const VendorModule = () => {
  const [vendors, setVendors] = useState(vendorData);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', crNumber: '', tradeLicense: '', address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Vendor Added',
      description: `${formData.name} has been added successfully.`,
    });
    setOpen(false);
    setFormData({ name: '', email: '', phone: '', crNumber: '', tradeLicense: '', address: '' });
  };

  const handleDelete = (id: string, name: string) => {
    setVendors(vendors.filter(v => v.id !== id));
    toast({
      title: 'Vendor Deleted',
      description: `${name} has been removed.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vendor Management</h3>
          <p className="text-sm text-muted-foreground">Manage supplier relationships</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription>Enter vendor details</DialogDescription>
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
              <div className="space-y-2">
                <Label htmlFor="tradeLicense">Trade License</Label>
                <Input id="tradeLicense" value={formData.tradeLicense} onChange={(e) => setFormData({ ...formData, tradeLicense: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit">Add Vendor</Button>
              </div>
            </form>
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
              <TableHead>Trade License</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>{vendor.email}</TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>{vendor.crNumber}</TableCell>
                <TableCell>{vendor.tradeLicense}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(vendor.id, vendor.name)}>
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
