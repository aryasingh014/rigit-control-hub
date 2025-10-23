import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DemoCredentials = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const credentials = [
    { role: 'Admin', email: 'admin@demo.com', password: 'admin123', color: 'default' },
    { role: 'Sales / Operations', email: 'sales@demo.com', password: 'sales123', color: 'secondary' },
    { role: 'Warehouse / Logistics', email: 'warehouse@demo.com', password: 'warehouse123', color: 'secondary' },
    { role: 'Finance', email: 'finance@demo.com', password: 'finance123', color: 'secondary' },
    { role: 'Vendor', email: 'vendor@demo.com', password: 'vendor123', color: 'secondary' },
    { role: 'Customer', email: 'customer@demo.com', password: 'customer123', color: 'secondary' },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/auth')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>

        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Demo Login Credentials</CardTitle>
            <CardDescription>
              Use these credentials to test different role dashboards. All forms and buttons are fully functional with demo data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((cred) => (
                  <TableRow key={cred.role}>
                    <TableCell>
                      <Badge variant={cred.color as any}>{cred.role}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{cred.email}</TableCell>
                    <TableCell className="font-mono text-sm">{cred.password}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(cred.email, 'Email')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(cred.password, 'Password')}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Quick Start Guide:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>First, sign up with any of the demo emails above (use the exact email)</li>
                <li>Select the corresponding role during signup</li>
                <li>After signup, you'll be redirected to your role-specific dashboard</li>
                <li>All forms, buttons, and features are fully interactive</li>
                <li>Test creating contracts, dispatching equipment, generating invoices, etc.</li>
              </ol>
            </div>

            <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
              <p className="text-sm font-medium">💡 Pro Tip:</p>
              <p className="text-sm text-muted-foreground mt-1">
                The Admin role has access to all other dashboards. Start there to see the full system overview.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemoCredentials;
