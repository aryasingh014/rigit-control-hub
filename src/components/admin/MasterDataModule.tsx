import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, Settings, DollarSign, Package, Users, Building } from 'lucide-react';

const uomData = [
  { id: '1', code: 'SET', name: 'Set', description: 'Complete equipment set' },
  { id: '2', code: 'PC', name: 'Piece', description: 'Individual piece' },
  { id: '3', code: 'UNIT', name: 'Unit', description: 'Single unit' },
];

const rateData = [
  { id: '1', itemCode: 'SCAFF-001', itemName: 'Aluminum Scaffolding Frame', dailyRate: 150, weeklyRate: 900, monthlyRate: 3600, currency: 'AED' },
  { id: '2', itemCode: 'SCAFF-002', name: 'Steel Support Beam', dailyRate: 75, weeklyRate: 450, monthlyRate: 1800, currency: 'AED' },
];

const currencyData = [
  { id: '1', code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', exchangeRate: 1.0, status: 'active' },
  { id: '2', code: 'USD', name: 'US Dollar', symbol: '$', exchangeRate: 3.67, status: 'active' },
  { id: '3', code: 'EUR', name: 'Euro', symbol: '€', exchangeRate: 4.02, status: 'active' },
];

const vatData = [
  { id: '1', rate: 5, name: 'Standard VAT', description: '5% VAT for most goods and services', effectiveFrom: '2024-01-01', status: 'active' },
  { id: '2', rate: 0, name: 'Zero Rated', description: '0% VAT for essential goods', effectiveFrom: '2024-01-01', status: 'active' },
];

export const MasterDataModule = () => {
  const [activeTab, setActiveTab] = useState('uom');
  const [uom, setUom] = useState(uomData);
  const [rates, setRates] = useState(rateData);
  const [currencies, setCurrencies] = useState(currencyData);
  const [vatRates, setVatRates] = useState(vatData);
  const [open, setOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: '', name: '', description: '', dailyRate: '', weeklyRate: '', monthlyRate: '', currency: 'AED',
    symbol: '', exchangeRate: '', rate: '', effectiveFrom: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle different form types based on active tab
    let newItem;
    switch (activeTab) {
      case 'uom':
        newItem = {
          id: (uom.length + 1).toString(),
          code: formData.code,
          name: formData.name,
          description: formData.description
        };
        setUom([...uom, newItem]);
        break;
      case 'rates':
        newItem = {
          id: (rates.length + 1).toString(),
          itemCode: formData.code,
          itemName: formData.name,
          dailyRate: parseInt(formData.dailyRate),
          weeklyRate: parseInt(formData.weeklyRate),
          monthlyRate: parseInt(formData.monthlyRate),
          currency: formData.currency
        };
        setRates([...rates, newItem]);
        break;
      case 'currency':
        newItem = {
          id: (currencies.length + 1).toString(),
          code: formData.code,
          name: formData.name,
          symbol: formData.symbol,
          exchangeRate: parseFloat(formData.exchangeRate),
          status: 'active'
        };
        setCurrencies([...currencies, newItem]);
        break;
      case 'vat':
        newItem = {
          id: (vatRates.length + 1).toString(),
          rate: parseInt(formData.rate),
          name: formData.name,
          description: formData.description,
          effectiveFrom: formData.effectiveFrom,
          status: 'active'
        };
        setVatRates([...vatRates, newItem]);
        break;
    }
    toast({
      title: 'Item Added',
      description: `${formData.name} has been added successfully.`,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      code: '', name: '', description: '', dailyRate: '', weeklyRate: '', monthlyRate: '', currency: 'AED',
      symbol: '', exchangeRate: '', rate: '', effectiveFrom: ''
    });
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    switch (activeTab) {
      case 'uom':
        setUom(uom.map(u => u.id === editingItem.id ? editingItem : u));
        break;
      case 'rates':
        setRates(rates.map(r => r.id === editingItem.id ? editingItem : r));
        break;
      case 'currency':
        setCurrencies(currencies.map(c => c.id === editingItem.id ? editingItem : c));
        break;
      case 'vat':
        setVatRates(vatRates.map(v => v.id === editingItem.id ? editingItem : v));
        break;
    }
    toast({
      title: 'Item Updated',
      description: `${editingItem.name} has been updated successfully.`,
    });
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string, name: string) => {
    switch (activeTab) {
      case 'uom':
        setUom(uom.filter(u => u.id !== id));
        break;
      case 'rates':
        setRates(rates.filter(r => r.id !== id));
        break;
      case 'currency':
        setCurrencies(currencies.filter(c => c.id !== id));
        break;
      case 'vat':
        setVatRates(vatRates.filter(v => v.id !== id));
        break;
    }
    toast({
      title: 'Item Deleted',
      description: `${name} has been removed.`,
    });
  };

  const renderUOMTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Unit of Measurement</h3>
          <p className="text-sm text-muted-foreground">Manage measurement units for equipment</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setActiveTab('uom')}>
              <Plus className="mr-2 h-4 w-4" />
              Add UoM
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {uom.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderRatesTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Rate Management</h3>
          <p className="text-sm text-muted-foreground">Configure pricing rates for equipment</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setActiveTab('rates')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Rate
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item Code</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Daily Rate</TableHead>
              <TableHead>Weekly Rate</TableHead>
              <TableHead>Monthly Rate</TableHead>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rates.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.itemCode}</TableCell>
                <TableCell>{item.itemName || item.name}</TableCell>
                <TableCell>{item.currency} {item.dailyRate}</TableCell>
                <TableCell>{item.currency} {item.weeklyRate}</TableCell>
                <TableCell>{item.currency} {item.monthlyRate}</TableCell>
                <TableCell>{item.currency}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.itemName || item.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderCurrencyTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Currency Configuration</h3>
          <p className="text-sm text-muted-foreground">Manage currency settings and exchange rates</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setActiveTab('currency')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Currency
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Exchange Rate</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currencies.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.symbol}</TableCell>
                <TableCell>{item.exchangeRate} AED</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderVATTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">VAT Configuration</h3>
          <p className="text-sm text-muted-foreground">Manage VAT rates and settings</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setActiveTab('vat')}>
              <Plus className="mr-2 h-4 w-4" />
              Add VAT Rate
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rate (%)</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Effective From</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vatRates.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.rate}%</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.effectiveFrom}</TableCell>
                <TableCell>
                  <Badge variant={item.status === 'active' ? 'default' : 'secondary'}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="mr-2" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(item.id, item.name)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  const renderFormDialog = () => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>
          {activeTab === 'uom' && 'Add Unit of Measurement'}
          {activeTab === 'rates' && 'Add Rate Configuration'}
          {activeTab === 'currency' && 'Add Currency'}
          {activeTab === 'vat' && 'Add VAT Rate'}
        </DialogTitle>
        <DialogDescription>
          {activeTab === 'uom' && 'Enter unit of measurement details'}
          {activeTab === 'rates' && 'Configure pricing rates'}
          {activeTab === 'currency' && 'Add currency configuration'}
          {activeTab === 'vat' && 'Configure VAT rate settings'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        {(activeTab === 'uom' || activeTab === 'currency') && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
          </div>
        )}
        {activeTab === 'rates' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Item Code</Label>
                <Input id="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dailyRate">Daily Rate</Label>
                <Input id="dailyRate" type="number" value={formData.dailyRate} onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeklyRate">Weekly Rate</Label>
                <Input id="weeklyRate" type="number" value={formData.weeklyRate} onChange={(e) => setFormData({ ...formData, weeklyRate: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyRate">Monthly Rate</Label>
                <Input id="monthlyRate" type="number" value={formData.monthlyRate} onChange={(e) => setFormData({ ...formData, monthlyRate: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select value={formData.currency} onValueChange={(val) => setFormData({ ...formData, currency: val })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.id} value={curr.code}>{curr.code} - {curr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        {activeTab === 'currency' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="symbol">Symbol</Label>
                <Input id="symbol" value={formData.symbol} onChange={(e) => setFormData({ ...formData, symbol: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchangeRate">Exchange Rate (to AED)</Label>
                <Input id="exchangeRate" type="number" step="0.01" value={formData.exchangeRate} onChange={(e) => setFormData({ ...formData, exchangeRate: e.target.value })} required />
              </div>
            </div>
          </>
        )}
        {activeTab === 'vat' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rate">VAT Rate (%)</Label>
                <Input id="rate" type="number" value={formData.rate} onChange={(e) => setFormData({ ...formData, rate: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="effectiveFrom">Effective From</Label>
                <Input id="effectiveFrom" type="date" value={formData.effectiveFrom} onChange={(e) => setFormData({ ...formData, effectiveFrom: e.target.value })} required />
              </div>
            </div>
          </>
        )}
        {(activeTab === 'uom' || activeTab === 'vat') && (
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
          </div>
        )}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit">Add Item</Button>
        </div>
      </form>
    </DialogContent>
  );

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Master Data Setup</h3>
        <p className="text-sm text-muted-foreground">Configure equipment, rates, currencies, and VAT settings</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="uom">Unit of Measurement</TabsTrigger>
          <TabsTrigger value="rates">Rate Management</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="vat">VAT Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="uom">{renderUOMTab()}</TabsContent>
        <TabsContent value="rates">{renderRatesTab()}</TabsContent>
        <TabsContent value="currency">{renderCurrencyTab()}</TabsContent>
        <TabsContent value="vat">{renderVATTab()}</TabsContent>
      </Tabs>

      <Dialog open={open} onOpenChange={setOpen}>
        {renderFormDialog()}
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Item</DialogTitle>
            <DialogDescription>Update item details</DialogDescription>
          </DialogHeader>
          {editingItem && (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              {/* Edit form fields would be similar to add form */}
              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Update Item</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};