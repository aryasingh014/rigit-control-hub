import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AddEquipmentDialog } from '@/components/forms/AddEquipmentDialog';
import { Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const equipmentData = [
  { id: '1', itemCode: 'SCAFF-001', description: 'Aluminum Scaffolding Frame', category: 'Scaffolding', unit: 'Set', dailyRate: 150, quantityTotal: 100, quantityAvailable: 45, status: 'available' },
  { id: '2', itemCode: 'SCAFF-002', description: 'Steel Support Beam', category: 'Scaffolding', unit: 'Piece', dailyRate: 75, quantityTotal: 200, quantityAvailable: 120, status: 'available' },
  { id: '3', itemCode: 'FORM-001', description: 'Plywood Formwork Panel', category: 'Formwork', unit: 'Set', dailyRate: 120, quantityTotal: 80, quantityAvailable: 35, status: 'available' },
  { id: '4', itemCode: 'SHORE-001', description: 'Adjustable Shoring Props', category: 'Shoring', unit: 'Piece', dailyRate: 90, quantityTotal: 150, quantityAvailable: 0, status: 'rented' },
];

export const EquipmentCatalogModule = () => {
  const [equipment, setEquipment] = useState(equipmentData);
  const { toast } = useToast();

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
          <p className="text-sm text-muted-foreground">Manage all equipment items</p>
        </div>
        <AddEquipmentDialog />
      </div>

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
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDelete(item.id, item.description)}
                  >
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
