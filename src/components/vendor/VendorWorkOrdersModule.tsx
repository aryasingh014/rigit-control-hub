import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { FileText, CheckCircle, Upload, Eye } from 'lucide-react';

const workOrdersData = [
  { id: 'WO-2025-045', project: 'Downtown Tower', client: 'ABC Construction LLC', description: 'Install scaffolding for floors 15-20', status: 'in_progress', priority: 'high', dueDate: 'Oct 25, 2025', createdDate: 'Oct 15, 2025' },
  { id: 'WO-2025-046', project: 'Marina Development', client: 'XYZ Builders', description: 'Deliver and setup safety equipment', status: 'pending', priority: 'medium', dueDate: 'Oct 28, 2025', createdDate: 'Oct 18, 2025' },
  { id: 'WO-2025-044', project: 'Mall Expansion', client: 'Elite Construction', description: 'Formwork assembly and installation', status: 'completed', priority: 'high', dueDate: 'Oct 20, 2025', createdDate: 'Oct 10, 2025' },
  { id: 'WO-2025-047', project: 'Residential Complex', client: 'Modern Builders', description: 'Mobile platform installation and testing', status: 'in_progress', priority: 'medium', dueDate: 'Nov 2, 2025', createdDate: 'Oct 22, 2025' },
];

export const VendorWorkOrdersModule = () => {
  const [workOrders, setWorkOrders] = useState(workOrdersData);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingWorkOrder, setViewingWorkOrder] = useState<any>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updatingWorkOrder, setUpdatingWorkOrder] = useState<any>(null);
  const { toast } = useToast();

  const handleView = (workOrder: any) => {
    setViewingWorkOrder(workOrder);
    setViewDialogOpen(true);
  };

  const handleUpdateStatus = (workOrder: any) => {
    setUpdatingWorkOrder(workOrder);
    setUpdateDialogOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWorkOrders(workOrders.map(w => w.id === updatingWorkOrder.id ? updatingWorkOrder : w));
    toast({
      title: 'Work Order Updated',
      description: `${updatingWorkOrder.id} status has been updated successfully.`,
    });
    setUpdateDialogOpen(false);
    setUpdatingWorkOrder(null);
  };

  const handleComplete = (id: string) => {
    setWorkOrders(workOrders.map(w => w.id === id ? { ...w, status: 'completed' } : w));
    toast({
      title: 'Work Order Completed',
      description: `${id} has been marked as completed.`,
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      pending: 'outline',
      assigned: 'secondary',
      in_progress: 'default',
      completed: 'default',
      cancelled: 'destructive',
    };
    return variants[status] || 'outline';
  };

  const getPriorityBadgeVariant = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
    };
    return variants[priority] || 'outline';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">My Work Orders</h3>
          <p className="text-sm text-muted-foreground">View and manage your assigned work orders</p>
        </div>
      </div>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Work Order Details</DialogTitle>
            <DialogDescription>Complete work order information</DialogDescription>
          </DialogHeader>
          {viewingWorkOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Work Order ID</Label>
                  <p className="text-sm text-muted-foreground">{viewingWorkOrder.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Project</Label>
                  <p className="text-sm text-muted-foreground">{viewingWorkOrder.project}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Client</Label>
                  <p className="text-sm text-muted-foreground">{viewingWorkOrder.client}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Due Date</Label>
                  <p className="text-sm text-muted-foreground">{viewingWorkOrder.dueDate}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground">{viewingWorkOrder.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Badge variant={getPriorityBadgeVariant(viewingWorkOrder.priority)}>
                    {viewingWorkOrder.priority}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge variant={getStatusBadgeVariant(viewingWorkOrder.status)}>
                    {viewingWorkOrder.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Work Order Status</DialogTitle>
            <DialogDescription>Update the status of your work order</DialogDescription>
          </DialogHeader>
          {updatingWorkOrder && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Work Order ID</Label>
                  <p className="text-sm text-muted-foreground">{updatingWorkOrder.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Project</Label>
                  <p className="text-sm text-muted-foreground">{updatingWorkOrder.project}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={updatingWorkOrder.status} onValueChange={(val) => setUpdatingWorkOrder({ ...updatingWorkOrder, status: val })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Update Notes</Label>
                <Textarea id="notes" placeholder="Add any notes about the work order status update..." />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Status</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work Order ID</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders.map((workOrder) => (
              <TableRow key={workOrder.id}>
                <TableCell className="font-medium">{workOrder.id}</TableCell>
                <TableCell>{workOrder.project}</TableCell>
                <TableCell>{workOrder.client}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityBadgeVariant(workOrder.priority)}>
                    {workOrder.priority}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{workOrder.dueDate}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(workOrder.status)}>
                    {workOrder.status.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleView(workOrder)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleUpdateStatus(workOrder)}>
                    <FileText className="h-4 w-4" />
                  </Button>
                  {workOrder.status !== 'completed' && (
                    <Button variant="ghost" size="icon" onClick={() => handleComplete(workOrder.id)}>
                      <CheckCircle className="h-4 w-4" />
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