import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

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
            <div className="space-y-4">
              {[
                {
                  contract: 'RC-2025-056',
                  project: 'Downtown Tower',
                  items: 'Scaffolding Set (Complete)',
                  startDate: 'Oct 1, 2025',
                  endDate: 'Oct 31, 2025',
                  status: 'active',
                },
                {
                  contract: 'RC-2025-068',
                  project: 'Residential Complex',
                  items: 'Safety Equipment Bundle',
                  startDate: 'Oct 10, 2025',
                  endDate: 'Nov 10, 2025',
                  status: 'active',
                },
                {
                  contract: 'RC-2025-042',
                  project: 'Office Building',
                  items: 'Mobile Platforms (x3)',
                  startDate: 'Sep 15, 2025',
                  endDate: 'Oct 27, 2025',
                  status: 'expiring_soon',
                },
              ].map((rental) => (
                <div
                  key={rental.contract}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{rental.contract}</p>
                      <Badge
                        variant={
                          rental.status === 'expiring_soon' ? 'destructive' : 'default'
                        }
                      >
                        {rental.status === 'expiring_soon' ? 'Expiring Soon' : 'Active'}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{rental.project}</p>
                    <p className="text-sm text-muted-foreground">{rental.items}</p>
                    <p className="text-xs text-muted-foreground">
                      {rental.startDate} - {rental.endDate}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Request Extension
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
