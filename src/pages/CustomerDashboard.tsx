import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Calendar, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const CustomerDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'customer' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout role="customer">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Customer Portal</h2>
          <p className="text-muted-foreground">
            View active rentals, invoices, and manage your account
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Rentals
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Currently rented</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Outstanding Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,900</div>
              <p className="text-xs text-muted-foreground mt-1">Due within 15 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Next Return
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 days</div>
              <p className="text-xs text-muted-foreground mt-1">Oct 27, 2025</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Rentals</CardTitle>
            <CardDescription>Equipment currently on rent</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Equipment</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { contract: 'RC-2025-056', project: 'Downtown Tower', items: 'Scaffolding Set (Complete)', startDate: 'Oct 1, 2025', endDate: 'Oct 31, 2025', status: 'active' },
                  { contract: 'RC-2025-068', project: 'Residential Complex', items: 'Safety Equipment Bundle', startDate: 'Oct 10, 2025', endDate: 'Nov 10, 2025', status: 'active' },
                  { contract: 'RC-2025-042', project: 'Office Building', items: 'Mobile Platforms (x3)', startDate: 'Sep 15, 2025', endDate: 'Oct 27, 2025', status: 'expiring_soon' },
                ].map((rental) => (
                  <TableRow key={rental.contract}>
                    <TableCell className="font-medium">{rental.contract}</TableCell>
                    <TableCell>{rental.project}</TableCell>
                    <TableCell className="text-sm">{rental.items}</TableCell>
                    <TableCell className="text-sm">{rental.startDate}</TableCell>
                    <TableCell className="text-sm">{rental.endDate}</TableCell>
                    <TableCell>
                      <Badge variant={rental.status === 'expiring_soon' ? 'destructive' : 'default'}>
                        {rental.status === 'expiring_soon' ? 'Expiring Soon' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Details</Button>
                        <Button variant="outline" size="sm">Extend</Button>
                      </div>
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
              <CardTitle>Invoices & Payments</CardTitle>
              <CardDescription>View and download your invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 'INV-2025-156', date: 'Oct 15, 2025', amount: '$12,500', status: 'paid' },
                    { id: 'INV-2025-168', date: 'Oct 20, 2025', amount: '$8,900', status: 'pending' },
                    { id: 'INV-2025-142', date: 'Oct 10, 2025', amount: '$6,200', status: 'paid' },
                  ].map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell className="text-sm">{invoice.date}</TableCell>
                      <TableCell className="font-semibold">{invoice.amount}</TableCell>
                      <TableCell>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" />
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest transactions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Payment processed', detail: 'Invoice INV-2025-156 - $12,500', date: 'Oct 15, 2025', type: 'payment' },
                  { action: 'Equipment delivered', detail: 'Contract RC-2025-068 - Safety Bundle', date: 'Oct 10, 2025', type: 'delivery' },
                  { action: 'Extension requested', detail: 'Contract RC-2025-056 - 15 days', date: 'Oct 8, 2025', type: 'extension' },
                  { action: 'Invoice generated', detail: 'INV-2025-168 - $8,900', date: 'Oct 5, 2025', type: 'invoice' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.detail}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
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

export default CustomerDashboard;
