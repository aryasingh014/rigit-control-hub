import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, DollarSign, CheckCircle, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VendorWorkOrdersModule } from '@/components/vendor/VendorWorkOrdersModule';
import { VendorInvoicesModule } from '@/components/vendor/VendorInvoicesModule';
import { VendorPaymentsModule } from '@/components/vendor/VendorPaymentsModule';

const VendorDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check for hash in URL to set active tab
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'workorders', 'invoices', 'payments'].includes(hash)) {
      setActiveTab(hash);
    }

    // Listen for custom tab change events from sidebar
    const handleTabChange = (event: any) => {
      if (event.detail && ['overview', 'workorders', 'invoices', 'payments'].includes(event.detail)) {
        setActiveTab(event.detail);
      }
    };

    // Listen for hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['overview', 'workorders', 'invoices', 'payments'].includes(hash)) {
        setActiveTab(hash);
      }
    };

    window.addEventListener('tabChange', handleTabChange);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('tabChange', handleTabChange);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'vendor' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout role="vendor">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h2>
          <p className="text-muted-foreground">
            Work orders, invoice submission, and payment tracking
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workorders">Work Orders</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Orders
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently assigned</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Payment
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$24,600</div>
                  <p className="text-xs text-muted-foreground mt-1">Across 3 invoices</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed (Month)
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground mt-1">Orders fulfilled</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Work Orders</CardTitle>
                  <CardDescription>Latest assignments and tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { id: 'WO-2025-045', project: 'Downtown Tower', status: 'in_progress' },
                        { id: 'WO-2025-046', project: 'Marina Development', status: 'pending' },
                        { id: 'WO-2025-044', project: 'Mall Expansion', status: 'completed' },
                      ].map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.project}</TableCell>
                          <TableCell>
                            <Badge variant={order.status === 'completed' ? 'default' : order.status === 'in_progress' ? 'secondary' : 'outline'}>
                              {order.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm" onClick={() => setActiveTab('workorders')}>View Details</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Payments</CardTitle>
                  <CardDescription>Latest payments received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { date: 'Oct 20, 2025', invoice: 'VI-2025-023', amount: '$8,200', method: 'Bank Transfer' },
                      { date: 'Oct 15, 2025', invoice: 'VI-2025-022', amount: '$6,750', method: 'Bank Transfer' },
                      { date: 'Oct 10, 2025', invoice: 'VI-2025-021', amount: '$9,500', method: 'Cheque' },
                    ].map((payment, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-semibold">{payment.invoice}</p>
                          <p className="text-xs text-muted-foreground">{payment.date} • {payment.method}</p>
                        </div>
                        <p className="font-bold text-success">{payment.amount}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('payments')}>
                    View All Payments
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workorders">
            <VendorWorkOrdersModule />
          </TabsContent>

          <TabsContent value="invoices">
            <VendorInvoicesModule />
          </TabsContent>

          <TabsContent value="payments">
            <VendorPaymentsModule />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
