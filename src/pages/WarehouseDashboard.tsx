import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, Truck, AlertCircle, FileText, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DispatchEquipmentDialog } from '@/components/forms/DispatchEquipmentDialog';
import { useToast } from '@/hooks/use-toast';

const WarehouseDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'warehouse' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    // Listen for warehouse tab change events from sidebar
    const handleWarehouseTabChange = (event: any) => {
      if (event.detail && ['overview', 'dispatch', 'returns', 'stock', 'reports'].includes(event.detail)) {
        setActiveTab(event.detail);
      }
    };

    window.addEventListener('warehouseTabChange', handleWarehouseTabChange);

    return () => {
      window.removeEventListener('warehouseTabChange', handleWarehouseTabChange);
    };
  }, []);

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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="dispatch">Dispatch</TabsTrigger>
            <TabsTrigger value="returns">Returns</TabsTrigger>
            <TabsTrigger value="stock">Stock</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
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
          </TabsContent>

          <TabsContent value="dispatch">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dispatch Management</CardTitle>
                    <CardDescription>Manage equipment dispatch and delivery</CardDescription>
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
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { contract: 'RC-2025-078', customer: 'ABC Construction', items: 15, priority: 'high', status: 'ready' },
                      { contract: 'RC-2025-079', customer: 'XYZ Builders', items: 8, priority: 'normal', status: 'ready' },
                      { contract: 'RC-2025-080', customer: 'Elite Construction', items: 22, priority: 'high', status: 'ready' },
                      { contract: 'RC-2025-081', customer: 'Modern Builders', items: 12, priority: 'normal', status: 'ready' },
                    ].map((dispatch) => (
                      <TableRow key={dispatch.contract}>
                        <TableCell className="font-medium">{dispatch.contract}</TableCell>
                        <TableCell>{dispatch.customer}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{dispatch.items} items</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={dispatch.priority === 'high' ? 'destructive' : 'secondary'}>
                            {dispatch.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default">{dispatch.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ title: 'Dispatch Started', description: `Starting dispatch for ${dispatch.contract}` })}
                            >
                              Start
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => toast({ title: 'Dispatch Completed', description: `Completed dispatch for ${dispatch.contract}` })}
                            >
                              Complete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="returns">
            <Card>
              <CardHeader>
                <CardTitle>Equipment Returns</CardTitle>
                <CardDescription>Track and manage equipment returns</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contract</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Return Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { contract: 'RC-2025-045', customer: 'ABC Construction', returnDate: 'Oct 25, 2025', status: 'on_time', items: 12 },
                      { contract: 'RC-2025-038', customer: 'Urban Developers', returnDate: 'Oct 23, 2025', status: 'overdue', items: 8 },
                      { contract: 'RC-2025-052', customer: 'Prime Construction', returnDate: 'Oct 27, 2025', status: 'on_time', items: 15 },
                      { contract: 'RC-2025-048', customer: 'New Project LLC', returnDate: 'Oct 24, 2025', status: 'confirmed', items: 6 },
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
                        <TableCell>
                          <Badge variant="outline">{returns.items} items</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ title: 'Return Processed', description: `Processing return for ${returns.contract}` })}
                            >
                              Process
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => toast({ title: 'Return Completed', description: `Completed return for ${returns.contract}` })}
                            >
                              Complete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card>
              <CardHeader>
                <CardTitle>Stock Management</CardTitle>
                <CardDescription>Monitor and manage inventory levels</CardDescription>
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
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { code: 'ST-6M', item: 'Scaffolding Tubes (6m)', available: 245, onRent: 180, total: 425, status: 'good' },
                      { code: 'BP-STD', item: 'Base Plates', available: 89, onRent: 156, total: 245, status: 'good' },
                      { code: 'CP-SW', item: 'Couplers (Swivel)', available: 34, onRent: 289, total: 323, status: 'low' },
                      { code: 'SH-PRO', item: 'Safety Harness', available: 12, onRent: 45, total: 57, status: 'critical' },
                      { code: 'PL-8M', item: 'Planks (8m)', available: 156, onRent: 234, total: 390, status: 'good' },
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
                          <TableCell>
                            <Badge variant={item.status === 'critical' ? 'destructive' : item.status === 'low' ? 'secondary' : 'default'}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ title: 'Stock Updated', description: `Updated stock for ${item.code}` })}
                            >
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Warehouse Reports</CardTitle>
                <CardDescription>Analytics and insights for warehouse operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Monthly Dispatches</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">156</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Equipment Utilization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">78%</div>
                      <p className="text-xs text-muted-foreground">Average across all items</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Return Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">94%</div>
                      <p className="text-xs text-muted-foreground">On-time returns</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">Warehouse performance chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default WarehouseDashboard;
