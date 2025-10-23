import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, FileText, Receipt } from 'lucide-react';
import { toast } from 'sonner';

interface Invoice {
  id: string;
  invoice_number: string;
  contract_id: string;
  amount: number;
  status: string;
  created_at: string;
  due_date?: string;
  contract_number?: string;
}

export const InvoicesModule = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    if (!user) return;

    try {
      // Mock invoices data for demonstration
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoice_number: 'INV-2025-156',
          contract_id: '1',
          amount: 12500,
          status: 'paid',
          created_at: '2025-10-15T00:00:00Z',
          due_date: '2025-10-30T00:00:00Z',
          contract_number: 'RC-2025-056',
        },
        {
          id: '2',
          invoice_number: 'INV-2025-168',
          contract_id: '2',
          amount: 8900,
          status: 'pending',
          created_at: '2025-10-20T00:00:00Z',
          due_date: '2025-11-04T00:00:00Z',
          contract_number: 'RC-2025-068',
        },
        {
          id: '3',
          invoice_number: 'INV-2025-142',
          contract_id: '3',
          amount: 15200,
          status: 'paid',
          created_at: '2025-10-10T00:00:00Z',
          due_date: '2025-10-25T00:00:00Z',
          contract_number: 'RC-2025-042',
        },
      ];

      // Try to fetch from database first
      const { data: contracts, error: contractsError } = await supabase
        .from('rental_contracts')
        .select('id, contract_number')
        .eq('customer_id', user.id);

      if (contractsError) {
        console.warn('Database fetch failed, using mock data:', contractsError);
        setInvoices(mockInvoices);
      } else if (!contracts || contracts.length === 0) {
        setInvoices([]);
      } else {
        // TODO: Fetch invoices from invoices table once it's implemented
        // For now, create mock invoices based on contracts
        const dbInvoices: Invoice[] = contracts.map((contract, index) => ({
          id: `inv-${contract.id}`,
          invoice_number: `INV-${contract.contract_number}`,
          contract_id: contract.id,
          amount: Math.floor(Math.random() * 10000) + 5000,
          status: index % 3 === 0 ? 'paid' : index % 3 === 1 ? 'pending' : 'overdue',
          created_at: new Date(Date.now() - (index * 7 * 24 * 60 * 60 * 1000)).toISOString(),
          due_date: new Date(Date.now() + ((index % 3) * 15 * 24 * 60 * 60 * 1000)).toISOString(),
          contract_number: contract.contract_number,
        }));

        setInvoices(dbInvoices.length > 0 ? dbInvoices : mockInvoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // Fallback to mock data
      const mockInvoices: Invoice[] = [
        {
          id: '1',
          invoice_number: 'INV-2025-156',
          contract_id: '1',
          amount: 12500,
          status: 'paid',
          created_at: '2025-10-15T00:00:00Z',
          due_date: '2025-10-30T00:00:00Z',
          contract_number: 'RC-2025-056',
        },
        {
          id: '2',
          invoice_number: 'INV-2025-168',
          contract_id: '2',
          amount: 8900,
          status: 'pending',
          created_at: '2025-10-20T00:00:00Z',
          due_date: '2025-11-04T00:00:00Z',
          contract_number: 'RC-2025-068',
        },
        {
          id: '3',
          invoice_number: 'INV-2025-142',
          contract_id: '3',
          amount: 15200,
          status: 'paid',
          created_at: '2025-10-10T00:00:00Z',
          due_date: '2025-10-25T00:00:00Z',
          contract_number: 'RC-2025-042',
        },
      ];
      setInvoices(mockInvoices);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    // TODO: Implement PDF download functionality
    toast.info('PDF download functionality coming soon');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      paid: 'default',
      pending: 'secondary',
      overdue: 'destructive',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Invoices</CardTitle>
          <CardDescription>Loading your invoices...</CardDescription>
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
        <CardHeader>
          <CardTitle>My Invoices</CardTitle>
          <CardDescription>View and download your invoices</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No invoices found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{invoice.contract_number}</TableCell>
                    <TableCell className="text-sm">{new Date(invoice.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="font-semibold">${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        PDF
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