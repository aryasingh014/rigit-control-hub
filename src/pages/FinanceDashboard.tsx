import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, FileText, AlertCircle, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { GenerateInvoiceDialog } from '@/components/forms/GenerateInvoiceDialog';
import { useToast } from '@/hooks/use-toast';

const FinanceDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'finance' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout role="finance">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Finance Dashboard</h2>
          <p className="text-muted-foreground">
            Invoicing, billing, and financial performance tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$125,430</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+23%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$18,920</div>
              <p className="text-xs text-muted-foreground mt-1">Across 7 invoices</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profit Margin
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34.5%</div>
              <p className="text-xs text-muted-foreground mt-1">Average this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Approval
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">Invoices to review</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
            <CardDescription>Latest billing and payment activities</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>VAT (5%)</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'INV-2025-089', customer: 'ABC Construction LLC', date: 'Oct 18, 2025', amount: 11905, vat: 595, status: 'paid' },
                  { id: 'INV-2025-090', customer: 'XYZ Builders', date: 'Oct 20, 2025', amount: 8476, vat: 424, status: 'pending' },
                  { id: 'INV-2025-091', customer: 'Elite Construction', date: 'Oct 15, 2025', amount: 14476, vat: 724, status: 'overdue' },
                  { id: 'INV-2025-092', customer: 'Modern Builders', date: 'Oct 21, 2025', amount: 6429, vat: 321, status: 'paid' },
                  { id: 'INV-2025-093', customer: 'Prime Construction', date: 'Oct 22, 2025', amount: 9524, vat: 476, status: 'pending' },
                ].map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell className="text-sm">{invoice.date}</TableCell>
                    <TableCell>${invoice.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">${invoice.vat}</TableCell>
                    <TableCell className="font-semibold">${(invoice.amount + invoice.vat).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={invoice.status === 'paid' ? 'default' : invoice.status === 'overdue' ? 'destructive' : 'secondary'}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contract Profitability</CardTitle>
              <CardDescription>Revenue vs Vendor Cost Analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { contract: 'RC-2025-001', revenue: 12500, cost: 8200, margin: 34.4 },
                    { contract: 'RC-2025-002', revenue: 8900, cost: 5800, margin: 34.8 },
                    { contract: 'RC-2025-003', revenue: 15200, cost: 9800, margin: 35.5 },
                    { contract: 'RC-2025-004', revenue: 6750, cost: 4500, margin: 33.3 },
                  ].map((item) => (
                    <TableRow key={item.contract}>
                      <TableCell className="font-medium">{item.contract}</TableCell>
                      <TableCell>${item.revenue.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground">${item.cost.toLocaleString()}</TableCell>
                      <TableCell className="font-semibold text-success">{item.margin}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deposit Tracking</CardTitle>
              <CardDescription>Customer deposits and refunds</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { customer: 'ABC Construction LLC', held: 5000, pending: 0, status: 'active' },
                  { customer: 'XYZ Builders', held: 3500, pending: 2000, status: 'partial_refund' },
                  { customer: 'Elite Construction', held: 7500, pending: 0, status: 'active' },
                  { customer: 'Modern Builders', held: 0, pending: 4500, status: 'refund_due' },
                ].map((deposit, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{deposit.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        Held: ${deposit.held.toLocaleString()} | Pending: ${deposit.pending.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={deposit.status === 'refund_due' ? 'destructive' : 'default'}>
                      {deposit.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinanceDashboard;
