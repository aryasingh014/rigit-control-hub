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
import { Plus, UserPlus, FileText, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Enquiry {
  id: string;
  customerName: string;
  company: string;
  contact: string;
  project: string;
  equipment: string;
  status: 'new' | 'quotation_sent' | 'approved' | 'rejected';
  createdDate: string;
  notes: string;
}

const EnquiryManagementModule = () => {
  const { toast } = useToast();
  const [enquiries, setEnquiries] = useState<Enquiry[]>([
    {
      id: 'ENQ-2025-001',
      customerName: 'John Smith',
      company: 'ABC Construction LLC',
      contact: '+1-555-0123',
      project: 'Skyline Tower',
      equipment: 'Complete Scaffolding System',
      status: 'new',
      createdDate: '2025-10-20',
      notes: 'Interested in long-term rental'
    },
    {
      id: 'ENQ-2025-002',
      customerName: 'Sarah Johnson',
      company: 'XYZ Builders',
      contact: '+1-555-0456',
      project: 'Residential Complex',
      equipment: 'Safety Equipment',
      status: 'quotation_sent',
      createdDate: '2025-10-18',
      notes: 'Needs quote by end of week'
    },
    {
      id: 'ENQ-2025-003',
      customerName: 'Mike Davis',
      company: 'Elite Construction',
      contact: '+1-555-0789',
      project: 'Mall Extension',
      equipment: 'Mobile Platforms',
      status: 'approved',
      createdDate: '2025-10-15',
      notes: 'Ready to proceed with contract'
    }
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEnquiry, setNewEnquiry] = useState({
    customerName: '',
    company: '',
    contact: '',
    project: '',
    equipment: '',
    notes: ''
  });

  const handleAddEnquiry = () => {
    if (!newEnquiry.customerName || !newEnquiry.company || !newEnquiry.project) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const enquiry: Enquiry = {
      id: `ENQ-2025-${String(enquiries.length + 1).padStart(3, '0')}`,
      ...newEnquiry,
      status: 'new',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setEnquiries([enquiry, ...enquiries]);
    setNewEnquiry({
      customerName: '',
      company: '',
      contact: '',
      project: '',
      equipment: '',
      notes: ''
    });
    setIsAddDialogOpen(false);
    toast({
      title: 'Success',
      description: 'Enquiry added successfully'
    });
  };

  const handleStatusChange = (id: string, newStatus: Enquiry['status']) => {
    setEnquiries(enquiries.map(enq =>
      enq.id === id ? { ...enq, status: newStatus } : enq
    ));
    toast({
      title: 'Status Updated',
      description: `Enquiry status changed to ${newStatus.replace('_', ' ')}`
    });
  };

  const handleConvertToQuotation = (enquiry: Enquiry) => {
    // This would trigger quotation creation
    toast({
      title: 'Convert to Quotation',
      description: `Creating quotation for ${enquiry.customerName}`
    });
  };

  const handleFollowUp = (enquiry: Enquiry) => {
    toast({
      title: 'Follow Up',
      description: `Following up with ${enquiry.customerName}`
    });
  };

  const getStatusColor = (status: Enquiry['status']) => {
    switch (status) {
      case 'new': return 'secondary';
      case 'quotation_sent': return 'default';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">CRM & Enquiry Management</h3>
          <p className="text-sm text-muted-foreground">Track and manage customer enquiries</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Enquiry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Enquiry</DialogTitle>
              <DialogDescription>
                Record a new customer enquiry with project details
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name *</Label>
                  <Input
                    id="customerName"
                    value={newEnquiry.customerName}
                    onChange={(e) => setNewEnquiry({...newEnquiry, customerName: e.target.value})}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={newEnquiry.company}
                    onChange={(e) => setNewEnquiry({...newEnquiry, company: e.target.value})}
                    placeholder="ABC Construction LLC"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact">Contact Number</Label>
                  <Input
                    id="contact"
                    value={newEnquiry.contact}
                    onChange={(e) => setNewEnquiry({...newEnquiry, contact: e.target.value})}
                    placeholder="+1-555-0123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project">Project Name *</Label>
                  <Input
                    id="project"
                    value={newEnquiry.project}
                    onChange={(e) => setNewEnquiry({...newEnquiry, project: e.target.value})}
                    placeholder="Skyline Tower"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment">Equipment Required</Label>
                <Input
                  id="equipment"
                  value={newEnquiry.equipment}
                  onChange={(e) => setNewEnquiry({...newEnquiry, equipment: e.target.value})}
                  placeholder="Complete Scaffolding System"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newEnquiry.notes}
                  onChange={(e) => setNewEnquiry({...newEnquiry, notes: e.target.value})}
                  placeholder="Additional requirements or notes"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddEnquiry}>
                Add Enquiry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Enquiry List</CardTitle>
          <CardDescription>Manage customer enquiries and track their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Enquiry ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Equipment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {enquiries.map((enquiry) => (
                <TableRow key={enquiry.id}>
                  <TableCell className="font-medium">{enquiry.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{enquiry.customerName}</p>
                      <p className="text-sm text-muted-foreground">{enquiry.company}</p>
                    </div>
                  </TableCell>
                  <TableCell>{enquiry.project}</TableCell>
                  <TableCell className="text-sm">{enquiry.equipment}</TableCell>
                  <TableCell>
                    <Select
                      value={enquiry.status}
                      onValueChange={(value: Enquiry['status']) => handleStatusChange(enquiry.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="quotation_sent">Quotation Sent</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-sm">{enquiry.createdDate}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConvertToQuotation(enquiry)}
                        disabled={enquiry.status !== 'new' && enquiry.status !== 'quotation_sent'}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Quote
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFollowUp(enquiry)}
                      >
                        <Phone className="h-3 w-3 mr-1" />
                        Follow Up
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

export default EnquiryManagementModule;