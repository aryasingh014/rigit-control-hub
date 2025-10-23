import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DispatchEquipmentDialog } from '@/components/forms/DispatchEquipmentDialog';
import { useToast } from '@/hooks/use-toast';

const WarehouseDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'warehouse' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout role="warehouse">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Warehouse Dashboard</h2>
          <p className="text-muted-foreground">
            Equipment tracking, dispatch management, and stock control
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Dispatch
              </CardTitle>
              <Truck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground mt-1">Orders ready for delivery</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Expected Returns
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">Due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">3</div>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Equipment Status</CardTitle>
            <CardDescription>Real-time inventory overview</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>On Rent</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Utilization</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { code: 'ST-6M', item: 'Scaffolding Tubes (6m)', available: 245, onRent: 180, total: 425 },
                  { code: 'BP-STD', item: 'Base Plates', available: 89, onRent: 156, total: 245 },
                  { code: 'CP-SW', item: 'Couplers (Swivel)', available: 34, onRent: 289, total: 323 },
                  { code: 'SH-PRO', item: 'Safety Harness', available: 12, onRent: 45, total: 57 },
                  { code: 'PL-8M', item: 'Planks (8m)', available: 156, onRent: 234, total: 390 },
                ].map((item) => {
                  const utilization = Math.round((item.onRent / item.total) * 100);
                  return (
                    <TableRow key={item.code}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.item}</TableCell>
                      <TableCell className="text-success font-semibold">{item.available}</TableCell>
                      <TableCell className="text-primary font-semibold">{item.onRent}</TableCell>
                      <TableCell>{item.total}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: `${utilization}%` }} />
                          </div>
                          <span className="text-sm">{utilization}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Dispatch</CardTitle>
                <CardDescription>Orders ready for delivery</CardDescription>
              </div>
              <DispatchEquipmentDialog />
            </div>
          </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { contract: 'RC-2025-078', customer: 'ABC Construction', items: 15, priority: 'high' },
                    { contract: 'RC-2025-079', customer: 'XYZ Builders', items: 8, priority: 'normal' },
                    { contract: 'RC-2025-080', customer: 'Elite Construction', items: 22, priority: 'high' },
                    { contract: 'RC-2025-081', customer: 'Modern Builders', items: 12, priority: 'normal' },
                  ].map((dispatch) => (
                    <TableRow key={dispatch.contract}>
                      <TableCell className="font-medium">{dispatch.contract}</TableCell>
                      <TableCell>{dispatch.customer}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{dispatch.items} items</Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant={dispatch.priority === 'high' ? 'default' : 'outline'}
                          onClick={() => toast({ title: 'Processing Dispatch', description: `Processing ${dispatch.contract}` })}
                        >
                          Process
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
              <CardTitle>Expected Returns</CardTitle>
              <CardDescription>Equipment due back this week</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Contract</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Return Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { contract: 'RC-2025-045', customer: 'ABC Construction', returnDate: 'Oct 25, 2025', status: 'on_time' },
                    { contract: 'RC-2025-038', customer: 'Urban Developers', returnDate: 'Oct 23, 2025', status: 'overdue' },
                    { contract: 'RC-2025-052', customer: 'Prime Construction', returnDate: 'Oct 27, 2025', status: 'on_time' },
                    { contract: 'RC-2025-048', customer: 'New Project LLC', returnDate: 'Oct 24, 2025', status: 'confirmed' },
                  ].map((returns) => (
                    <TableRow key={returns.contract}>
                      <TableCell className="font-medium">{returns.contract}</TableCell>
                      <TableCell>{returns.customer}</TableCell>
                      <TableCell className="text-sm">{returns.returnDate}</TableCell>
                      <TableCell>
                        <Badge variant={returns.status === 'overdue' ? 'destructive' : returns.status === 'confirmed' ? 'default' : 'secondary'}>
                          {returns.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WarehouseDashboard;
