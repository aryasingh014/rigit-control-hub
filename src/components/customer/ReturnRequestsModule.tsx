import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ReturnRequest {
  id: string;
  contract_number: string;
  request_type: 'early_return' | 'loss_report';
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  description: string;
  created_at: string;
  equipment_items?: string[];
}

export const ReturnRequestsModule = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [requestType, setRequestType] = useState<'early_return' | 'loss_report'>('early_return');
  const [contractNumber, setContractNumber] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [user]);

  const fetchRequests = async () => {
    if (!user) return;

    try {
      // Mock data for demo
      const mockRequests: ReturnRequest[] = [
        {
          id: '1',
          contract_number: 'RC-2025-056',
          request_type: 'early_return',
          status: 'pending',
          description: 'Need to return equipment early due to project completion',
          created_at: '2025-10-20',
        },
        {
          id: '2',
          contract_number: 'RC-2025-042',
          request_type: 'loss_report',
          status: 'approved',
          description: 'Lost safety harness during transport',
          created_at: '2025-10-15',
        },
      ];

      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching return requests:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async () => {
    if (!contractNumber || !description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Mock submission for now
      const newRequest: ReturnRequest = {
        id: Date.now().toString(),
        contract_number: contractNumber,
        request_type: requestType,
        status: 'pending',
        description,
        created_at: new Date().toISOString().split('T')[0],
      };

      setRequests(prev => [newRequest, ...prev]);
      setShowRequestDialog(false);
      setContractNumber('');
      setDescription('');
      toast.success('Return request submitted successfully');
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Failed to submit request');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      completed: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getRequestTypeIcon = (type: string) => {
    return type === 'early_return' ? <Calendar className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Return Requests</CardTitle>
          <CardDescription>Loading your return requests...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Return Requests</CardTitle>
            <CardDescription>Submit early returns or report lost equipment</CardDescription>
          </div>
          <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Return Request</DialogTitle>
                <DialogDescription>
                  Request an early return or report lost equipment
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="request-type">Request Type</Label>
                  <Select value={requestType} onValueChange={(value: 'early_return' | 'loss_report') => setRequestType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="early_return">Early Return</SelectItem>
                      <SelectItem value="loss_report">Report Lost Item</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="contract-number">Contract Number</Label>
                  <Input
                    id="contract-number"
                    value={contractNumber}
                    onChange={(e) => setContractNumber(e.target.value)}
                    placeholder="e.g., RC-2025-056"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details about your request..."
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitRequest}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No return requests found</p>
              <p className="text-sm text-muted-foreground mt-2">Submit your first request using the button above</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.contract_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getRequestTypeIcon(request.request_type)}
                        {request.request_type === 'early_return' ? 'Early Return' : 'Loss Report'}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{request.description}</TableCell>
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="text-sm">{new Date(request.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        View Status
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};