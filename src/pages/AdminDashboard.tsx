import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Users, FileText, TrendingUp, Truck, DollarSign } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Equipment"
            value="156"
            icon={Package}
            trend={12}
          />
          <StatCard
            title="Active Contracts"
            value="42"
            icon={FileText}
            trend={8}
          />
          <StatCard
            title="Total Customers"
            value="89"
            icon={Users}
            trend={15}
          />
          <StatCard
            title="Monthly Revenue"
            value="$125,430"
            icon={DollarSign}
            trend={23}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system activities and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'New contract created', user: 'Sales Team', time: '5 min ago', type: 'contract' },
                  { action: 'Equipment dispatched', user: 'Warehouse', time: '15 min ago', type: 'dispatch' },
                  { action: 'Invoice generated', user: 'Finance', time: '1 hour ago', type: 'invoice' },
                  { action: 'New customer added', user: 'Sales Team', time: '2 hours ago', type: 'customer' },
                  { action: 'Payment received', user: 'Finance', time: '3 hours ago', type: 'payment' },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">{activity.type}</Badge>
                      <div>
                        <p className="font-medium text-sm">{activity.action}</p>
                        <p className="text-xs text-muted-foreground">{activity.user}</p>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
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

        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Cross-department status and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Active Tasks</TableHead>
                  <TableHead>Pending Approvals</TableHead>
                  <TableHead>Completed (Today)</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { dept: 'Sales', active: 15, pending: 8, completed: 12, status: 'good' },
                  { dept: 'Warehouse', active: 9, pending: 6, completed: 18, status: 'excellent' },
                  { dept: 'Finance', active: 12, pending: 5, completed: 14, status: 'good' },
                  { dept: 'Vendors', active: 8, pending: 3, completed: 10, status: 'good' },
                ].map((dept) => (
                  <TableRow key={dept.dept}>
                    <TableCell className="font-medium">{dept.dept}</TableCell>
                    <TableCell>{dept.active}</TableCell>
                    <TableCell>{dept.pending}</TableCell>
                    <TableCell>{dept.completed}</TableCell>
                    <TableCell>
                      <Badge variant={dept.status === 'excellent' ? 'default' : 'secondary'}>
                        {dept.status}
                      </Badge>
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

export default AdminDashboard;
