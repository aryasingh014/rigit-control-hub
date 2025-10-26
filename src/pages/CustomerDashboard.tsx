import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Calendar, Download, FileText, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RentalsModule } from '@/components/customer/RentalsModule';
import { InvoicesModule } from '@/components/customer/InvoicesModule';
import { ProfileModule } from '@/components/customer/ProfileModule';
import { ReturnRequestsModule } from '@/components/customer/ReturnRequestsModule';
import { OrderModule } from '@/components/customer/OrderModule';
import { NotificationsModule } from '@/components/customer/NotificationsModule';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CustomerDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch customer info
  const { data: customerInfo } = useQuery({
    queryKey: ['customer-info', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('email', user.email)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.email
  });

  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['customer-stats', customerInfo?.id],
    queryFn: async () => {
      if (!customerInfo?.id) return null;
      
      const [contractsRes, invoicesRes] = await Promise.all([
        supabase.from('rental_contracts').select('*').eq('customer_id', customerInfo.id),
        supabase.from('invoices').select('*').eq('customer_id', customerInfo.id)
      ]);

      const activeContracts = contractsRes.data?.filter(c => c.status === 'active').length || 0;
      const totalInvoices = invoicesRes.data?.length || 0;
      const outstandingPayments = invoicesRes.data
        ?.filter(inv => inv.status === 'unpaid' || inv.status === 'overdue')
        .reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

      return {
        activeContracts,
        totalInvoices,
        outstandingPayments,
        equipmentRented: contractsRes.data?.length || 0
      };
    },
    enabled: !!customerInfo?.id
  });

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'order', 'rentals', 'invoices', 'returns', 'notifications', 'profile'].includes(hash)) {
      setActiveTab(hash);
    }

    const handleTabChange = (event: any) => {
      if (event.detail && ['overview', 'order', 'rentals', 'invoices', 'returns', 'notifications', 'profile'].includes(event.detail)) {
        setActiveTab(event.detail);
      }
    };

    window.addEventListener('customerTabChange', handleTabChange);
    return () => window.removeEventListener('customerTabChange', handleTabChange);
  }, []);

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
           <TabsList className="grid w-full grid-cols-7">
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="order">Place Order</TabsTrigger>
             <TabsTrigger value="rentals">My Rentals</TabsTrigger>
             <TabsTrigger value="invoices">Invoices</TabsTrigger>
             <TabsTrigger value="returns">Returns</TabsTrigger>
             <TabsTrigger value="notifications">Notifications</TabsTrigger>
             <TabsTrigger value="profile">Profile</TabsTrigger>
           </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Contracts
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeContracts || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Currently active</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Invoices
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalInvoices || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">All time</p>
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
                  <div className="text-2xl font-bold text-destructive">
                    ${stats?.outstandingPayments.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Due payments</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Equipment Rented
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.equipmentRented || 0}</div>
                  <p className="text-xs text-muted-foreground mt-1">Total contracts</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common customer tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                   <button
                     onClick={() => setActiveTab('order')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <Package className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">Place New Order</p>
                       <p className="text-xs text-muted-foreground">Request equipment rental</p>
                     </div>
                   </button>
                   <button
                     onClick={() => setActiveTab('rentals')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <FileText className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">View My Rentals</p>
                       <p className="text-xs text-muted-foreground">Check active contracts and equipment</p>
                     </div>
                   </button>
                   <button
                     onClick={() => setActiveTab('invoices')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <DollarSign className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">View Invoices</p>
                       <p className="text-xs text-muted-foreground">Download and pay invoices</p>
                     </div>
                   </button>
                   <button
                     onClick={() => setActiveTab('returns')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <Calendar className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">Return Requests</p>
                       <p className="text-xs text-muted-foreground">Submit early returns or report damaged items</p>
                     </div>
                   </button>
                   <button
                     onClick={() => setActiveTab('profile')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <User className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">My Profile</p>
                       <p className="text-xs text-muted-foreground">Update account information</p>
                     </div>
                   </button>
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
          </TabsContent>

          <TabsContent value="order">
            <OrderModule />
          </TabsContent>

          <TabsContent value="rentals">
            <RentalsModule />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesModule />
          </TabsContent>

          <TabsContent value="returns">
            <ReturnRequestsModule />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationsModule />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileModule />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
