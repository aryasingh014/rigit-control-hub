import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Download, Calendar, FileText, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const RentalsModule = () => {
  const { user } = useAuth();
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const { data: customerInfo } = useQuery({
    queryKey: ['customer-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase.from('customers').select('*').eq('email', user.email).single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  const { data: contracts } = useQuery({
    queryKey: ['rental-contracts', customerInfo?.id],
    queryFn: async () => {
      if (!customerInfo?.id) return [];
      const { data, error } = await supabase.from('rental_contracts').select('*').eq('customer_id', customerInfo.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!customerInfo?.id
  });

  const getStatusBadge = (contract: any) => {
    const today = new Date();
    const endDate = new Date(contract.end_date);
    const daysLeft = differenceInDays(endDate, today);
    if (contract.status === 'completed' || contract.status === 'closed') return { variant: 'secondary' as const, label: 'Completed' };
    if (daysLeft < 0) return { variant: 'destructive' as const, label: 'Overdue' };
    if (daysLeft <= 5) return { variant: 'destructive' as const, label: 'Expiring Soon' };
    if (contract.status === 'active') return { variant: 'default' as const, label: 'Active' };
    return { variant: 'secondary' as const, label: contract.status };
  };

  const getDaysLeft = (endDate: string) => {
    const days = differenceInDays(new Date(endDate), new Date());
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Today';
    return `${days} days`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Package className="h-6 w-6 text-primary" />
        <div>
          <h3 className="text-2xl font-bold">My Rentals</h3>
          <p className="text-muted-foreground">View and manage your active and past equipment rentals</p>
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contract ID</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Days Left</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!contracts || contracts.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No rental contracts found</TableCell></TableRow>
              ) : (
                contracts.map((contract) => {
                  const statusInfo = getStatusBadge(contract);
                  return (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.contract_number}</TableCell>
                      <TableCell>{contract.project_name || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(contract.start_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>{format(new Date(contract.end_date), 'MMM dd, yyyy')}</TableCell>
                      <TableCell><div className="flex items-center gap-1"><Clock className="h-4 w-4" />{getDaysLeft(contract.end_date)}</div></TableCell>
                      <TableCell>${contract.grand_total?.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={statusInfo.variant}>{statusInfo.label}</Badge></TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Dialog>
                            <DialogTrigger asChild><Button variant="outline" size="sm" onClick={() => setSelectedContract(contract)}><FileText className="h-4 w-4 mr-1" />View</Button></DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader><DialogTitle>Contract Details</DialogTitle></DialogHeader>
                              {selectedContract && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div><p className="text-sm text-muted-foreground">Contract Number</p><p className="font-medium">{selectedContract.contract_number}</p></div>
                                    <div><p className="text-sm text-muted-foreground">Status</p><Badge variant={getStatusBadge(selectedContract).variant}>{getStatusBadge(selectedContract).label}</Badge></div>
                                    <div><p className="text-sm text-muted-foreground">Grand Total</p><p className="font-medium text-lg text-primary">${selectedContract.grand_total?.toLocaleString()}</p></div>
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" />PDF</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
