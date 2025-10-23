import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

export const AddEquipmentDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    itemCode: '',
    description: '',
    category: '',
    unit: '',
    dailyRate: '',
    quantity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Equipment Added',
      description: `${formData.description} has been added to the catalog.`,
    });
    setOpen(false);
    setFormData({ itemCode: '', description: '', category: '', unit: '', dailyRate: '', quantity: '' });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Equipment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Equipment</DialogTitle>
          <DialogDescription>Add equipment to the catalog</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemCode">Item Code</Label>
              <Input
                id="itemCode"
                value={formData.itemCode}
                onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                placeholder="SCAFF-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scaffolding">Scaffolding</SelectItem>
                  <SelectItem value="formwork">Formwork</SelectItem>
                  <SelectItem value="shoring">Shoring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Aluminum Scaffolding Frame"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select value={formData.unit} onValueChange={(val) => setFormData({ ...formData, unit: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="set">Set</SelectItem>
                  <SelectItem value="piece">Piece</SelectItem>
                  <SelectItem value="meter">Meter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dailyRate">Daily Rate (AED)</Label>
              <Input
                id="dailyRate"
                type="number"
                value={formData.dailyRate}
                onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                placeholder="150"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Total Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="100"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Equipment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
