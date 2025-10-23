import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Users, TrendingUp, Plus, DollarSign, Calendar, BarChart3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreateContractDialog } from '@/components/forms/CreateContractDialog';
import { CustomerModule } from '@/components/admin/CustomerModule';
import { ContractsModule } from '@/components/admin/ContractsModule';
import { InvoicesModule } from '@/components/admin/InvoicesModule';
import EnquiryManagementModule from '@/components/sales/EnquiryManagementModule';
import QuotationManagementModule from '@/components/sales/QuotationManagementModule';
import SalesOrderManagementModule from '@/components/sales/SalesOrderManagementModule';
import CustomerCommunicationModule from '@/components/sales/CustomerCommunicationModule';
import { useToast } from '@/hooks/use-toast';

const SalesDashboard = () => {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    } else if (!loading && role && role !== 'sales' && role !== 'admin') {
      navigate(`/${role}`);
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    // Listen for sales tab change events from sidebar
    const handleSalesTabChange = (event: any) => {
      if (event.detail && ['contracts', 'quotations', 'customers', 'reports', 'enquiries', 'sales-orders', 'communication'].includes(event.detail)) {
        const tabMap: Record<string, string> = {
          'contracts': 'contracts',
          'quotations': 'quotations',
          'customers': 'customers',
          'reports': 'reports',
          'enquiries': 'enquiries',
          'sales-orders': 'sales-orders',
          'communication': 'communication'
        };
        setActiveTab(tabMap[event.detail] || 'overview');
      }
    };

    window.addEventListener('salesTabChange', handleSalesTabChange);

    return () => {
      window.removeEventListener('salesTabChange', handleSalesTabChange);
    };
  }, []);

  if (loading) return null;

  return (
    <DashboardLayout role="sales">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Sales Dashboard</h2>
          <p className="text-muted-foreground">
            Manage rental contracts, quotations, and customer relationships
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
           <TabsList className="grid w-full grid-cols-8">
             <TabsTrigger value="overview">Overview</TabsTrigger>
             <TabsTrigger value="enquiries">Enquiries</TabsTrigger>
             <TabsTrigger value="quotations">Quotations</TabsTrigger>
             <TabsTrigger value="sales-orders">Sales Orders</TabsTrigger>
             <TabsTrigger value="contracts">Contracts</TabsTrigger>
             <TabsTrigger value="customers">Customers</TabsTrigger>
             <TabsTrigger value="communication">Communication</TabsTrigger>
             <TabsTrigger value="reports">Reports</TabsTrigger>
           </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <div></div>
              <CreateContractDialog />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <Calendar className="h-4 w-4 text-muted-foreground" />
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
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$89,245</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-success">+12%</span> vs last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Customers
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-success">+3</span> new this month
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
          </TabsContent>

          <TabsContent value="enquiries">
            <EnquiryManagementModule />
          </TabsContent>

          <TabsContent value="quotations">
            <QuotationManagementModule />
          </TabsContent>

          <TabsContent value="sales-orders">
            <SalesOrderManagementModule />
          </TabsContent>

          <TabsContent value="contracts">
            <ContractsModule />
          </TabsContent>

          <TabsContent value="customers">
            <CustomerModule />
          </TabsContent>

          <TabsContent value="communication">
            <CustomerCommunicationModule />
          </TabsContent>

          <TabsContent value="reports">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Reports</CardTitle>
                  <CardDescription>Analytics and insights for sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Enquiry Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">68%</div>
                        <p className="text-xs text-muted-foreground">+5% from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Monthly Revenue</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$89,245</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Active Contracts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">42</div>
                        <p className="text-xs text-muted-foreground">+5 new this week</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Average Deal Size</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">$2,125</div>
                        <p className="text-xs text-muted-foreground">+8% from last month</p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Revenue chart will be displayed here</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Active vs Closed Contracts Summary</CardTitle>
                    <CardDescription>Overview of contract status distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="font-medium">Active Contracts</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">42</p>
                          <p className="text-sm text-muted-foreground">75% of total</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                          <span className="font-medium">Closed Contracts</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">14</p>
                          <p className="text-sm text-muted-foreground">25% of total</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span className="font-medium">Pending Approval</span>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">8</p>
                          <p className="text-sm text-muted-foreground">Awaiting review</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enquiry to Contract Conversion</CardTitle>
                    <CardDescription>Track the sales funnel performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Enquiries</span>
                          <span className="font-medium">150</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '100%'}}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Quotations Sent</span>
                          <span className="font-medium">102</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{width: '68%'}}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Approved Quotations</span>
                          <span className="font-medium">78</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{width: '52%'}}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Active Contracts</span>
                          <span className="font-medium">42</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{width: '28%'}}></div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Conversion Rate:</strong> 28% (Enquiries to Contracts)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Download Reports</CardTitle>
                  <CardDescription>Export detailed sales reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <Button variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Download Excel Report
                    </Button>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      View Detailed Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default SalesDashboard;
