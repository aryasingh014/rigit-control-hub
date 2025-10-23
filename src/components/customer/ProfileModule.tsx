import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Building, Phone, Mail, MapPin, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  cr_number?: string;
  vat_number?: string;
  credit_limit?: number;
  deposit_amount?: number;
}

export const ProfileModule = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Mock profile data for demonstration
      const mockProfile: CustomerProfile = {
        id: user.id,
        name: 'ABC Construction LLC',
        email: user.email || 'customer@example.com',
        phone: '+971-50-123-4567',
        address: '123 Business District, Dubai, UAE',
        cr_number: 'CR123456789',
        vat_number: 'VAT987654321',
        credit_limit: 50000,
        deposit_amount: 5000,
      };

      // Try to fetch from database first
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.warn('Database fetch failed, using mock data:', error);
        setProfile(mockProfile);
      } else {
        setProfile(data || mockProfile);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Fallback to mock data
      const mockProfile: CustomerProfile = {
        id: user.id,
        name: 'ABC Construction LLC',
        email: user.email || 'customer@example.com',
        phone: '+971-50-123-4567',
        address: '123 Business District, Dubai, UAE',
        cr_number: 'CR123456789',
        vat_number: 'VAT987654321',
        credit_limit: 50000,
        deposit_amount: 5000,
      };
      setProfile(mockProfile);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          address: profile.address,
          cr_number: profile.cr_number,
          vat_number: profile.vat_number,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    fetchProfile(); // Reset to original data
    setIsEditing(false);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Loading your profile information...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Profile information not found</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Unable to load profile data.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </div>
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="name">Company Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profile.name}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profile.phone || ''}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profile.phone || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Textarea
                      id="address"
                      value={profile.address || ''}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profile.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="cr_number">CR Number</Label>
                  {isEditing ? (
                    <Input
                      id="cr_number"
                      value={profile.cr_number || ''}
                      onChange={(e) => setProfile({ ...profile, cr_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profile.cr_number || 'Not provided'}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div className="flex-1">
                  <Label htmlFor="vat_number">VAT Number</Label>
                  {isEditing ? (
                    <Input
                      id="vat_number"
                      value={profile.vat_number || ''}
                      onChange={(e) => setProfile({ ...profile, vat_number: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1">{profile.vat_number || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Credit Limit</p>
                  <p className="text-sm text-muted-foreground">Maximum credit allowed</p>
                </div>
                <p className="text-lg font-semibold">${profile.credit_limit?.toLocaleString() || '0'}</p>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Deposit Amount</p>
                  <p className="text-sm text-muted-foreground">Security deposit</p>
                </div>
                <p className="text-lg font-semibold">${profile.deposit_amount?.toLocaleString() || '0'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};