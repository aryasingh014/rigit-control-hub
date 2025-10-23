import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, TrendingUp, DollarSign, Package, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const reportTypes = [
  { id: '1', title: 'Revenue Report', description: 'Monthly and yearly revenue analysis', icon: DollarSign },
  { id: '2', title: 'Equipment Utilization', description: 'Equipment usage and efficiency metrics', icon: Package },
  { id: '3', title: 'Customer Analytics', description: 'Customer behavior and trends', icon: Users },
  { id: '4', title: 'Rental Contracts', description: 'Active and completed contracts overview', icon: FileText },
  { id: '5', title: 'Performance Dashboard', description: 'Overall business performance metrics', icon: TrendingUp },
];

export const ReportsModule = () => {
  const { toast } = useToast();

  const handleGenerateReport = (title: string) => {
    toast({
      title: 'Report Generated',
      description: `${title} has been generated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Reports & Analytics</h3>
        <p className="text-sm text-muted-foreground">Generate and download business reports</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Report Generation</CardTitle>
          <CardDescription>Select date range and report type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Report Type</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue Report</SelectItem>
                  <SelectItem value="equipment">Equipment Utilization</SelectItem>
                  <SelectItem value="customer">Customer Analytics</SelectItem>
                  <SelectItem value="contracts">Rental Contracts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Period</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Format</label>
              <Select defaultValue="pdf">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Generate & Download Report
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <report.icon className="h-8 w-8 text-primary" />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleGenerateReport(report.title)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-2">{report.title}</h4>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
