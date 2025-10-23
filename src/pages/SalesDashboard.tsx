import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, TrendingUp, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreateContractDialog } from '@/components/forms/CreateContractDialog';
import { useToast } from '@/hooks/use-toast';

const SalesDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'sales' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout role="sales">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
            <p className="text-muted-foreground">
              Manage rental contracts, quotations, and customer relationships
            </p>
          </div>
          <CreateContractDialog />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Contracts
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+5</span> new this week
              </p>
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
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue (Month)
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$89,245</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="text-success">+12%</span> vs last month
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Contracts</CardTitle>
              <CardDescription>Latest rental agreements and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 'RC-2025-001', customer: 'ABC Construction LLC', amount: '$12,500', status: 'active' },
                    { id: 'RC-2025-002', customer: 'XYZ Builders', amount: '$8,900', status: 'pending_approval' },
                    { id: 'RC-2024-089', customer: 'Elite Construction', amount: '$15,200', status: 'active' },
                    { id: 'RC-2025-003', customer: 'Modern Builders', amount: '$6,750', status: 'draft' },
                  ].map((contract) => (
                    <TableRow key={contract.id}>
                      <TableCell className="font-medium">{contract.id}</TableCell>
                      <TableCell>{contract.customer}</TableCell>
                      <TableCell className="font-semibold">{contract.amount}</TableCell>
                      <TableCell>
                        <Badge variant={contract.status === 'active' ? 'default' : 'secondary'}>
                          {contract.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
              <CardDescription>Highest revenue generators this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'ABC Construction LLC', contracts: 8, revenue: '$42,500', trend: '+15%' },
                  { name: 'Elite Construction', contracts: 5, revenue: '$38,200', trend: '+8%' },
                  { name: 'XYZ Builders', contracts: 6, revenue: '$31,400', trend: '+22%' },
                  { name: 'Modern Builders', contracts: 4, revenue: '$24,800', trend: '+5%' },
                ].map((customer, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{customer.name}</p>
                      <p className="text-sm text-muted-foreground">{customer.contracts} active contracts</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{customer.revenue}</p>
                      <p className="text-xs text-success">{customer.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Quotations</CardTitle>
            <CardDescription>Awaiting customer approval</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Quote ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Valid Until</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { id: 'QT-2025-045', customer: 'New Project LLC', project: 'Skyline Tower', equipment: 'Complete Scaffolding', amount: '$18,500', validUntil: 'Oct 30, 2025' },
                  { id: 'QT-2025-046', customer: 'Urban Developers', project: 'Residential Complex', equipment: 'Safety Equipment', amount: '$9,200', validUntil: 'Oct 28, 2025' },
                  { id: 'QT-2025-047', customer: 'Prime Construction', project: 'Mall Extension', equipment: 'Mobile Platforms', amount: '$12,800', validUntil: 'Nov 5, 2025' },
                ].map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.id}</TableCell>
                    <TableCell>{quote.customer}</TableCell>
                    <TableCell>{quote.project}</TableCell>
                    <TableCell className="text-sm">{quote.equipment}</TableCell>
                    <TableCell className="font-semibold">{quote.amount}</TableCell>
                    <TableCell className="text-sm">{quote.validUntil}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({ title: 'Follow Up', description: `Following up with ${quote.customer}` })}
                      >
                        Follow Up
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SalesDashboard;
