import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Edit, Upload, RefreshCw } from 'lucide-react';

const vendorProfileData = {
  name: 'Steel Supplies LLC',
  email: 'sales@steelsupplies.ae',
  phone: '+971-4-111-2222',
  crNumber: 'CR-98765',
  vatNumber: 'VAT-12345',
  tradeLicense: 'TL-11111',
  address: 'Industrial Area 1, Dubai, UAE',
  licenseExpiry: 'Dec 31, 2025',
  crExpiry: 'Mar 15, 2026'
};

export const VendorProfileModule = () => {
  const [profile, setProfile] = useState(vendorProfileData);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const { toast } = useToast();

  const handleEdit = () => {
    setEditingProfile({ ...profile });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editingProfile);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    });
    setEditDialogOpen(false);
    setEditingProfile(null);
  };

  const handleUploadLicense = () => {
    toast({
      title: 'Upload Started',
      description: 'License upload dialog would open here.',
    });
  };

  const handleRenewCR = () => {
    toast({
      title: 'Renewal Process',
      description: 'CR renewal process would start here.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vendor Profile</h3>
          <p className="text-sm text-muted-foreground">Manage your company information and licenses</p>
        </div>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
            <CardDescription>Basic company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Company Name</Label>
                <p className="text-sm text-muted-foreground">{profile.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Email</Label>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Phone</Label>
                <p className="text-sm text-muted-foreground">{profile.phone}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Address</Label>
                <p className="text-sm text-muted-foreground">{profile.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Legal Documents</CardTitle>
            <CardDescription>CR, VAT, and license information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">CR Number</Label>
                <p className="text-sm text-muted-foreground">{profile.crNumber}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">VAT Number</Label>
                <p className="text-sm text-muted-foreground">{profile.vatNumber}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Trade License</Label>
                <p className="text-sm text-muted-foreground">{profile.tradeLicense}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">License Expiry</Label>
                <p className="text-sm text-muted-foreground">{profile.licenseExpiry}</p>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">CR Expiry</Label>
              <p className="text-sm text-muted-foreground">{profile.crExpiry}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Management</CardTitle>
          <CardDescription>Upload and renew your business documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleUploadLicense}>
              <Upload className="mr-2 h-4 w-4" />
              Upload License
            </Button>
            <Button variant="outline" onClick={handleRenewCR}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Renew CR
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your company information</DialogDescription>
          </DialogHeader>
          {editingProfile && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Company Name</Label>
                  <Input id="edit-name" value={editingProfile.name} onChange={(e) => setEditingProfile({ ...editingProfile, name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email</Label>
                  <Input id="edit-email" type="email" value={editingProfile.email} onChange={(e) => setEditingProfile({ ...editingProfile, email: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone</Label>
                  <Input id="edit-phone" value={editingProfile.phone} onChange={(e) => setEditingProfile({ ...editingProfile, phone: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-address">Address</Label>
                  <Input id="edit-address" value={editingProfile.address} onChange={(e) => setEditingProfile({ ...editingProfile, address: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-crNumber">CR Number</Label>
                  <Input id="edit-crNumber" value={editingProfile.crNumber} onChange={(e) => setEditingProfile({ ...editingProfile, crNumber: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vatNumber">VAT Number</Label>
                  <Input id="edit-vatNumber" value={editingProfile.vatNumber} onChange={(e) => setEditingProfile({ ...editingProfile, vatNumber: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tradeLicense">Trade License</Label>
                  <Input id="edit-tradeLicense" value={editingProfile.tradeLicense} onChange={(e) => setEditingProfile({ ...editingProfile, tradeLicense: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-licenseExpiry">License Expiry</Label>
                  <Input id="edit-licenseExpiry" value={editingProfile.licenseExpiry} onChange={(e) => setEditingProfile({ ...editingProfile, licenseExpiry: e.target.value })} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-crExpiry">CR Expiry</Label>
                <Input id="edit-crExpiry" value={editingProfile.crExpiry} onChange={(e) => setEditingProfile({ ...editingProfile, crExpiry: e.target.value })} required />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Profile</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};