import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, FileText, Package } from 'lucide-react';
import { toast } from 'sonner';

interface Rental {
  id: string;
  contract_number: string;
  project_name: string;
  start_date: string;
  end_date: string;
  status: string;
  total_amount: number;
  equipment_items?: string[];
}

export const RentalsModule = () => {
  const { user } = useAuth();
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  useEffect(() => {
    fetchRentals();
  }, [user]);

  const fetchRentals = async () => {
    if (!user) return;

    try {
      // For now, use mock data since the database might not have customer data
      const mockRentals = [
        {
          id: '1',
          contract_number: 'RC-2025-056',
          project_name: 'Downtown Tower',
          start_date: '2025-10-01',
          end_date: '2025-10-31',
          status: 'active',
          total_amount: 12500,
        },
        {
          id: '2',
          contract_number: 'RC-2025-068',
          project_name: 'Residential Complex',
          start_date: '2025-10-10',
          end_date: '2025-11-10',
          status: 'active',
          total_amount: 8900,
        },
        {
          id: '3',
          contract_number: 'RC-2025-042',
          project_name: 'Office Building',
          start_date: '2025-09-15',
          end_date: '2025-10-27',
          status: 'expiring_soon',
          total_amount: 15200,
        },
      ];

      // Try to fetch from database first
      const { data, error } = await supabase
        .from('rental_contracts')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Database fetch failed, using mock data:', error);
        setRentals(mockRentals);
      } else {
        setRentals(data && data.length > 0 ? data : mockRentals);
      }
    } catch (error) {
      console.error('Error fetching rentals:', error);
      // Fallback to mock data
      const mockRentals = [
        {
          id: '1',
          contract_number: 'RC-2025-056',
          project_name: 'Downtown Tower',
          start_date: '2025-10-01',
          end_date: '2025-10-31',
          status: 'active',
          total_amount: 12500,
        },
        {
          id: '2',
          contract_number: 'RC-2025-068',
          project_name: 'Residential Complex',
          start_date: '2025-10-10',
          end_date: '2025-11-10',
          status: 'active',
          total_amount: 8900,
        },
        {
          id: '3',
          contract_number: 'RC-2025-042',
          project_name: 'Office Building',
          start_date: '2025-09-15',
          end_date: '2025-10-27',
          status: 'expiring_soon',
          total_amount: 15200,
        },
      ];
      setRentals(mockRentals);
    } finally {
      setLoading(false);
    }
  };

  const handleExtendRental = async (rentalId: string) => {
    // TODO: Implement extend rental functionality - open dialog for extension
    toast.info('Extend rental functionality coming soon');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      active: 'default',
      extended: 'secondary',
      returned: 'secondary',
      closed: 'destructive',
      pending_approval: 'secondary',
      draft: 'secondary',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Rentals</CardTitle>
          <CardDescription>Loading your rental contracts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>My Rentals</CardTitle>
          <CardDescription>Equipment currently on rent</CardDescription>
        </CardHeader>
        <CardContent>
          {rentals.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No active rentals found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contract ID</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rentals.map((rental) => (
                  <TableRow key={rental.id}>
                    <TableCell className="font-medium">{rental.contract_number}</TableCell>
                    <TableCell>{rental.project_name || 'N/A'}</TableCell>
                    <TableCell className="text-sm">{new Date(rental.start_date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-sm">{new Date(rental.end_date).toLocaleDateString()}</TableCell>
                    <TableCell>{getStatusBadge(rental.status)}</TableCell>
                    <TableCell className="font-semibold">${rental.total_amount?.toLocaleString() || '0'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedRental(rental)}>
                              <FileText className="h-3 w-3 mr-1" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Rental Details - {rental.contract_number}</DialogTitle>
                              <DialogDescription>
                                Complete information about this rental contract
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Project Name</label>
                                  <p className="text-sm text-muted-foreground">{rental.project_name || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Contract Status</label>
                                  <div className="mt-1">{getStatusBadge(rental.status)}</div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Start Date</label>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(rental.start_date).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">End Date</label>
                                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(rental.end_date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <label className="text-sm font-medium">Total Amount</label>
                                <p className="text-lg font-semibold">${rental.total_amount?.toLocaleString() || '0'}</p>
                              </div>
                              {/* TODO: Add equipment items list */}
                              <div className="pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                  Equipment details will be displayed here once integrated with the equipment catalog.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        {(rental.status === 'active' || rental.status === 'extended') && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleExtendRental(rental.id)}
                          >
                            Extend
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};