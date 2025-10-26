import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, FileText, DollarSign, Settings as SettingsIcon, BarChart3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EquipmentCatalogModule } from '@/components/admin/EquipmentCatalogModule';
import { CustomerModule } from '@/components/admin/CustomerModule';
import { UsersRolesModule } from '@/components/admin/UsersRolesModule';
import { ProfileModule } from '@/components/customer/ProfileModule';
import { ReportsModule } from '@/components/admin/ReportsModule';
import { SettingsModule } from '@/components/admin/SettingsModule';
import { ContractsModule } from '@/components/admin/ContractsModule';
import { InvoicesModule } from '@/components/admin/InvoicesModule';
import { WorkOrdersModule } from '@/components/admin/WorkOrdersModule';
import { DispatchModule } from '@/components/admin/DispatchModule';
import { MasterDataModule } from '@/components/admin/MasterDataModule';
import { InventoryModule } from '@/components/admin/InventoryModule';
import { FinanceModule } from '@/components/admin/FinanceModule';

const StatCard = ({ title, value, icon: Icon, trend }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">
          <span className="text-success">+{trend}%</span> from last month
        </p>
      )}
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Check for hash in URL to set active tab
    const hash = window.location.hash.replace('#', '');
    if (hash && ['overview', 'equipment', 'customers', 'users', 'masterdata', 'contracts', 'inventory', 'finance', 'invoices', 'workorders', 'dispatch', 'reports', 'profile'].includes(hash)) {
      setActiveTab(hash);
    }

    // Listen for custom tab change events from sidebar
    const handleTabChange = (event: any) => {
      if (event.detail && ['overview', 'equipment', 'customers', 'users', 'masterdata', 'contracts', 'inventory', 'finance', 'invoices', 'workorders', 'dispatch', 'reports', 'profile'].includes(event.detail)) {
        setActiveTab(event.detail);
      }
    };

    window.addEventListener('tabChange', handleTabChange);

    return () => {
      window.removeEventListener('tabChange', handleTabChange);
    };
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  if (loading) {
    return (
      <DashboardLayout role="admin">
        <div className="space-y-6">
          <Skeleton className="h-32 w-full" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">
            Complete control over system configuration and operations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="border-b">
              <div className="flex flex-wrap gap-1 pb-2">
                <TabsList className="h-auto p-1 bg-transparent">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Overview</TabsTrigger>
                  <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Users & Roles</TabsTrigger>
                  <TabsTrigger value="masterdata" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Master Data</TabsTrigger>
                  <TabsTrigger value="contracts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contract Oversight</TabsTrigger>
                  <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Inventory</TabsTrigger>
                  <TabsTrigger value="finance" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Finance</TabsTrigger>
                  <TabsTrigger value="equipment" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Equipment</TabsTrigger>
                  <TabsTrigger value="customers" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Customers</TabsTrigger>
                  <TabsTrigger value="invoices" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Invoices</TabsTrigger>
                  <TabsTrigger value="workorders" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Work Orders</TabsTrigger>
                  <TabsTrigger value="dispatch" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Dispatch</TabsTrigger>
                  <TabsTrigger value="reports" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Reports</TabsTrigger>
                  <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Profile</TabsTrigger>
                </TabsList>
              </div>
            </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Equipment" value="156" icon={Package} trend={12} />
              <StatCard title="Active Contracts" value="42" icon={FileText} trend={8} />
              <StatCard title="Total Customers" value="89" icon={Users} trend={15} />
              <StatCard title="Monthly Revenue" value="$125,430" icon={DollarSign} trend={23} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('equipment')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Equipment</p>
                      <p className="text-xs text-muted-foreground">Add, edit, or remove equipment</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('customers')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Manage Customers</p>
                      <p className="text-xs text-muted-foreground">Customer accounts and credits</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('users')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">User Management</p>
                      <p className="text-xs text-muted-foreground">Add users and assign roles</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                  >
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Generate Reports</p>
                      <p className="text-xs text-muted-foreground">Business analytics and insights</p>
                    </div>
                  </button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Equipment Utilization</CardTitle>
                  <CardDescription>Current equipment status breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { status: 'On Rent', count: 87, color: 'bg-primary' },
                      { status: 'Available', count: 54, color: 'bg-success' },
                      { status: 'Maintenance', count: 12, color: 'bg-warning' },
                      { status: 'Reserved', count: 3, color: 'bg-accent' },
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{item.status}</span>
                          <span className="text-muted-foreground">{item.count}</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color}`}
                            style={{ width: `${(item.count / 156) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="equipment">
            <EquipmentCatalogModule />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerModule />
          </TabsContent>

          <TabsContent value="users">
            <UsersRolesModule />
          </TabsContent>

          <TabsContent value="masterdata">
            <MasterDataModule />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsModule />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryModule />
          </TabsContent>

          <TabsContent value="finance">
            <FinanceModule />
          </TabsContent>

          <TabsContent value="invoices">
            <InvoicesModule />
          </TabsContent>

          <TabsContent value="workorders">
            <WorkOrdersModule />
          </TabsContent>

          <TabsContent value="dispatch">
            <DispatchModule />
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

export default AdminDashboard;
