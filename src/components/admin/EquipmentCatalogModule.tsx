import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddEquipmentDialog } from '@/components/forms/AddEquipmentDialog';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const equipmentData = [
  { id: '1', itemCode: 'SCAFF-001', description: 'Aluminum Scaffolding Frame', category: 'Scaffolding', unit: 'Set', dailyRate: 150, quantityTotal: 100, quantityAvailable: 45, status: 'available', approvalStatus: 'approved' },
  { id: '2', itemCode: 'SCAFF-002', description: 'Steel Support Beam', category: 'Scaffolding', unit: 'Piece', dailyRate: 75, quantityTotal: 200, quantityAvailable: 120, status: 'available', approvalStatus: 'approved' },
  { id: '3', itemCode: 'FORM-001', description: 'Plywood Formwork Panel', category: 'Formwork', unit: 'Set', dailyRate: 120, quantityTotal: 80, quantityAvailable: 35, status: 'available', approvalStatus: 'pending' },
  { id: '4', itemCode: 'SHORE-001', description: 'Adjustable Shoring Props', category: 'Shoring', unit: 'Piece', dailyRate: 90, quantityTotal: 150, quantityAvailable: 0, status: 'rented', approvalStatus: 'approved' },
];

export const EquipmentCatalogModule = () => {
  const [equipment, setEquipment] = useState(equipmentData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  const handleApproveEquipment = (item: any) => {
    const updatedItem = { ...item, approvalStatus: 'approved' };
    setEquipment(equipment.map(e => e.id === item.id ? updatedItem : e));
    toast({
      title: 'Equipment Approved',
      description: `${item.description} has been approved for use.`,
    });
  };

  const handleRejectEquipment = (item: any) => {
    setEquipment(equipment.filter(e => e.id !== item.id));
    toast({
      title: 'Equipment Rejected',
      description: `${item.description} has been rejected and removed.`,
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEquipment(equipment.map(e => e.id === editingItem.id ? editingItem : e));
    toast({
      title: 'Equipment Updated',
      description: `${editingItem.description} has been updated successfully.`,
    });
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, description: string) => {
    setEquipment(equipment.filter(e => e.id !== id));
    toast({
      title: 'Equipment Deleted',
      description: `${description} has been removed from the catalog.`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Equipment Catalog</h3>
          <p className="text-sm text-muted-foreground">Manage equipment items with approval workflows</p>
        </div>
        <AddEquipmentDialog />
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Equipment</DialogTitle>
            <DialogDescription>Update equipment details</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemCode">Item Code</Label>
                  <Input
                    id="itemCode"
                    value={editingItem.itemCode}
                    onChange={(e) => setEditingItem({ ...editingItem, itemCode: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={editingItem.category} onValueChange={(val) => setEditingItem({ ...editingItem, category: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Scaffolding">Scaffolding</SelectItem>
                      <SelectItem value="Formwork">Formwork</SelectItem>
                      <SelectItem value="Shoring">Shoring</SelectItem>
                      <SelectItem value="Safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select value={editingItem.unit} onValueChange={(val) => setEditingItem({ ...editingItem, unit: val })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Set">Set</SelectItem>
                      <SelectItem value="Piece">Piece</SelectItem>
                      <SelectItem value="Unit">Unit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Rate (AED)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    value={editingItem.dailyRate}
                    onChange={(e) => setEditingItem({ ...editingItem, dailyRate: parseInt(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantityTotal">Total Quantity</Label>
                  <Input
                    id="quantityTotal"
                    type="number"
                    value={editingItem.quantityTotal}
                    onChange={(e) => setEditingItem({ ...editingItem, quantityTotal: parseInt(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantityAvailable">Available Quantity</Label>
                <Input
                  id="quantityAvailable"
                  type="number"
                  value={editingItem.quantityAvailable}
                  onChange={(e) => setEditingItem({ ...editingItem, quantityAvailable: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Equipment</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Code</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Total Qty</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {equipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.itemCode}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>AED {item.dailyRate}</TableCell>
                <TableCell>{item.quantityTotal}</TableCell>
                <TableCell>{item.quantityAvailable}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={item.approvalStatus === 'approved' ? 'default' : 'outline'}>
                    {item.approvalStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-1 justify-end">
                    {item.approvalStatus === 'pending' && (
                      <>
                        <Button variant="ghost" size="icon" title="Approve Equipment" onClick={() => handleApproveEquipment(item)}>
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Reject Equipment" onClick={() => handleRejectEquipment(item)}>
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon" title="Edit Equipment" onClick={() => handleEdit(item)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Delete Equipment" onClick={() => handleDelete(item.id, item.description)}>
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
