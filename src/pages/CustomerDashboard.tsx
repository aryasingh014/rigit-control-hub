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
import { SupportCommunicationModule } from '@/components/customer/SupportCommunicationModule';
import { ReportsModule } from '@/components/customer/ReportsModule';

const CustomerDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check for hash in URL to set active tab
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'rentals', 'invoices', 'returns', 'support', 'reports', 'profile'].includes(hash)) {
      setActiveTab(hash);
    }

    // Listen for custom tab change events from sidebar
    const handleTabChange = (event: any) => {
      if (event.detail && ['overview', 'rentals', 'invoices', 'returns', 'support', 'reports', 'profile'].includes(event.detail)) {
        setActiveTab(event.detail);
      }
    };

    window.addEventListener('customerTabChange', handleTabChange);

    return () => {
      window.removeEventListener('customerTabChange', handleTabChange);
    };
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
             <TabsTrigger value="rentals">My Rentals</TabsTrigger>
             <TabsTrigger value="invoices">Invoices & Payments</TabsTrigger>
             <TabsTrigger value="returns">Return Requests</TabsTrigger>
             <TabsTrigger value="support">Support & Communication</TabsTrigger>
             <TabsTrigger value="reports">Reports</TabsTrigger>
             <TabsTrigger value="profile">Profile</TabsTrigger>
           </TabsList>

          <TabsContent value="overview" className="space-y-4">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common customer tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
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
                       <p className="text-xs text-muted-foreground">Submit early returns or report lost items</p>
                     </div>
                   </button>
                   <button
                     onClick={() => setActiveTab('support')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <User className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">Contact Support</p>
                       <p className="text-xs text-muted-foreground">Chat with sales or warehouse teams</p>
                     </div>
                   </button>
                   <button
                     onClick={() => setActiveTab('reports')}
                     className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                   >
                     <Download className="h-5 w-5 text-primary" />
                     <div>
                       <p className="font-medium">Download Reports</p>
                       <p className="text-xs text-muted-foreground">Rental summary and outstanding balance</p>
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

          <TabsContent value="rentals">
            <RentalsModule />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesModule />
          </TabsContent>

          <TabsContent value="returns">
            <ReturnRequestsModule />
          </TabsContent>

          <TabsContent value="support">
            <SupportCommunicationModule />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsModule />
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
