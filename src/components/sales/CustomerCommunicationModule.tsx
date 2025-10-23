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
import { Mail, MessageSquare, FileText, Phone, History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Communication {
  id: string;
  customerName: string;
  company: string;
  type: 'email' | 'whatsapp' | 'call' | 'contract_summary' | 'invoice' | 'reminder';
  subject: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'pending';
  sentDate: string;
  contractId?: string;
  invoiceId?: string;
}

const CustomerCommunicationModule = () => {
  const { toast } = useToast();
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 'COMM-2025-001',
      customerName: 'John Smith',
      company: 'ABC Construction LLC',
      type: 'contract_summary',
      subject: 'Contract Summary - Skyline Tower Project',
      message: 'Attached is the summary of your rental contract including terms and conditions.',
      status: 'sent',
      sentDate: '2025-10-20',
      contractId: 'RC-2025-001'
    },
    {
      id: 'COMM-2025-002',
      customerName: 'Sarah Johnson',
      company: 'XYZ Builders',
      type: 'invoice',
      subject: 'Invoice #INV-2025-001 - Payment Due',
      message: 'Your invoice for the safety equipment rental is now available.',
      status: 'delivered',
      sentDate: '2025-10-19',
      invoiceId: 'INV-2025-001'
    },
    {
      id: 'COMM-2025-003',
      customerName: 'Mike Davis',
      company: 'Elite Construction',
      type: 'reminder',
      subject: 'Payment Reminder - Contract RC-2024-089',
      message: 'This is a friendly reminder that payment for your active contract is due.',
      status: 'pending',
      sentDate: '2025-10-22'
    }
  ]);

  const [isSendDialogOpen, setIsSendDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [communicationType, setCommunicationType] = useState<Communication['type']>('email');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  // Mock customers data - in real app this would come from API
  const customers = [
    { id: '1', name: 'John Smith', company: 'ABC Construction LLC', email: 'john@abc.com', phone: '+1-555-0123' },
    { id: '2', name: 'Sarah Johnson', company: 'XYZ Builders', email: 'sarah@xyz.com', phone: '+1-555-0456' },
    { id: '3', name: 'Mike Davis', company: 'Elite Construction', email: 'mike@elite.com', phone: '+1-555-0789' }
  ];

  const handleSendCommunication = () => {
    if (!selectedCustomer || !subject || !message) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    if (!customer) return;

    const communication: Communication = {
      id: `COMM-2025-${String(communications.length + 1).padStart(3, '0')}`,
      customerName: customer.name,
      company: customer.company,
      type: communicationType,
      subject,
      message,
      status: 'sent',
      sentDate: new Date().toISOString().split('T')[0]
    };

    setCommunications([communication, ...communications]);
    setSelectedCustomer('');
    setCommunicationType('email');
    setSubject('');
    setMessage('');
    setIsSendDialogOpen(false);

    toast({
      title: 'Communication Sent',
      description: `${communicationType.charAt(0).toUpperCase() + communicationType.slice(1)} sent to ${customer.name}`
    });
  };

  const handleSendContractSummary = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const communication: Communication = {
      id: `COMM-2025-${String(communications.length + 1).padStart(3, '0')}`,
      customerName: customer.name,
      company: customer.company,
      type: 'contract_summary',
      subject: 'Contract Summary and Terms',
      message: 'Please find attached the summary of your rental contract including all terms, conditions, and payment details.',
      status: 'sent',
      sentDate: new Date().toISOString().split('T')[0],
      contractId: 'RC-2025-001' // Would be dynamic
    };

    setCommunications([communication, ...communications]);
    toast({
      title: 'Contract Summary Sent',
      description: `Contract summary sent to ${customer.name}`
    });
  };

  const handleSendInvoice = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const communication: Communication = {
      id: `COMM-2025-${String(communications.length + 1).padStart(3, '0')}`,
      customerName: customer.name,
      company: customer.company,
      type: 'invoice',
      subject: 'Invoice for Equipment Rental',
      message: 'Your invoice is now available. Please review and process payment according to the terms.',
      status: 'sent',
      sentDate: new Date().toISOString().split('T')[0],
      invoiceId: 'INV-2025-001' // Would be dynamic
    };

    setCommunications([communication, ...communications]);
    toast({
      title: 'Invoice Sent',
      description: `Invoice sent to ${customer.name}`
    });
  };

  const handleSendReminder = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;

    const communication: Communication = {
      id: `COMM-2025-${String(communications.length + 1).padStart(3, '0')}`,
      customerName: customer.name,
      company: customer.company,
      type: 'reminder',
      subject: 'Payment Reminder',
      message: 'This is a friendly reminder that payment for your rental contract is due. Please ensure timely payment to avoid any service interruptions.',
      status: 'sent',
      sentDate: new Date().toISOString().split('T')[0]
    };

    setCommunications([communication, ...communications]);
    toast({
      title: 'Reminder Sent',
      description: `Payment reminder sent to ${customer.name}`
    });
  };

  const getTypeIcon = (type: Communication['type']) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      case 'call': return <Phone className="h-4 w-4" />;
      case 'contract_summary': return <FileText className="h-4 w-4" />;
      case 'invoice': return <FileText className="h-4 w-4" />;
      case 'reminder': return <Mail className="h-4 w-4" />;
      default: return <Mail className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Communication['status']) => {
    switch (status) {
      case 'sent': return 'default';
      case 'delivered': return 'default';
      case 'read': return 'default';
      case 'pending': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Customer Communication</h3>
          <p className="text-sm text-muted-foreground">Send emails, WhatsApp messages, and manage customer communications</p>
        </div>
        <Dialog open={isSendDialogOpen} onOpenChange={setIsSendDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Send Communication</DialogTitle>
              <DialogDescription>
                Send email, WhatsApp message, or other communication to a customer
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Select Customer *</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Communication Type *</Label>
                <Select value={communicationType} onValueChange={(value: Communication['type']) => setCommunicationType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp Message</SelectItem>
                    <SelectItem value="call">Phone Call</SelectItem>
                    <SelectItem value="contract_summary">Contract Summary</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                    <SelectItem value="reminder">Payment Reminder</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter subject line"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsSendDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendCommunication}>
                Send Communication
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {customers.slice(0, 3).map((customer) => (
                <div key={customer.id} className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendContractSummary(customer.id)}
                    className="flex-1"
                  >
                    Contract to {customer.name.split(' ')[0]}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendInvoice(customer.id)}
                    className="flex-1"
                  >
                    Invoice
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendReminder(customer.id)}
                  >
                    Reminder
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Communication Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Sent</span>
                <span className="font-medium">{communications.filter(c => c.status === 'sent').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Delivered</span>
                <span className="font-medium">{communications.filter(c => c.status === 'delivered').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Pending</span>
                <span className="font-medium">{communications.filter(c => c.status === 'pending').length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {communications.slice(0, 3).map((comm) => (
                <div key={comm.id} className="text-sm">
                  <p className="font-medium">{comm.type.replace('_', ' ')} to {comm.customerName}</p>
                  <p className="text-muted-foreground">{comm.sentDate}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Communication History</CardTitle>
          <CardDescription>View all customer communications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Sent Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {communications.map((comm) => (
                <TableRow key={comm.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(comm.type)}
                      <span className="capitalize">{comm.type.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{comm.customerName}</p>
                      <p className="text-sm text-muted-foreground">{comm.company}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{comm.subject}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(comm.status)}>
                      {comm.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{comm.sentDate}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <History className="h-3 w-3 mr-1" />
                      View
                    </Button>
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

export default CustomerCommunicationModule;