import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  Truck,
  DollarSign,
  Settings,
  LogOut,
  Building2,
  Menu,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  role: string;
}

const roleMenuItems = {
  admin: [
    { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { title: 'Equipment Catalog', icon: Package, path: '/admin/equipment' },
    { title: 'Customers', icon: Users, path: '/admin/customers' },
    { title: 'Vendors', icon: Truck, path: '/admin/vendors' },
    { title: 'Users & Roles', icon: Users, path: '/admin/users' },
    { title: 'Reports', icon: FileText, path: '/admin/reports' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ],
  sales: [
    { title: 'Overview', icon: LayoutDashboard, path: '/sales' },
    { title: 'Contracts', icon: FileText, path: '/sales/contracts' },
    { title: 'Quotations', icon: FileText, path: '/sales/quotations' },
    { title: 'Customers', icon: Users, path: '/sales/customers' },
    { title: 'Reports', icon: FileText, path: '/sales/reports' },
  ],
  warehouse: [
    { title: 'Overview', icon: LayoutDashboard, path: '/warehouse' },
    { title: 'Dispatch', icon: Truck, path: '/warehouse/dispatch' },
    { title: 'Returns', icon: Package, path: '/warehouse/returns' },
    { title: 'Stock', icon: Package, path: '/warehouse/stock' },
    { title: 'Reports', icon: FileText, path: '/warehouse/reports' },
  ],
  finance: [
    { title: 'Overview', icon: LayoutDashboard, path: '/finance' },
    { title: 'Invoices', icon: FileText, path: '/finance/invoices' },
    { title: 'Payments', icon: DollarSign, path: '/finance/payments' },
    { title: 'Reports', icon: FileText, path: '/finance/reports' },
  ],
  vendor: [
    { title: 'Overview', icon: LayoutDashboard, path: '/vendor' },
    { title: 'Work Orders', icon: FileText, path: '/vendor/orders' },
    { title: 'Invoices', icon: DollarSign, path: '/vendor/invoices' },
  ],
  customer: [
    { title: 'Overview', icon: LayoutDashboard, path: '/customer' },
    { title: 'Active Rentals', icon: Package, path: '/customer/rentals' },
    { title: 'Billing', icon: DollarSign, path: '/customer/billing' },
  ],
};

const AppSidebar = ({ role }: { role: string }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const menuItems = roleMenuItems[role as keyof typeof roleMenuItems] || [];

  return (
    <Sidebar className={cn(collapsed ? 'w-14' : 'w-64')}>
      <SidebarContent>
        <div className="p-4 flex items-center gap-2 border-b border-sidebar-border">
          <div className="p-2 bg-sidebar-primary rounded-lg">
            <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-sidebar-foreground">Scaffolding</h2>
              <p className="text-xs text-muted-foreground capitalize">{role} Dashboard</p>
            </div>
          )}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.path)}
                      className="flex items-center gap-3 w-full"
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-sidebar-border">
          <Button
            variant="outline"
            className="w-full"
            onClick={signOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {!collapsed && 'Sign Out'}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardLayout = ({ children, role }: DashboardLayoutProps) => {
  return (
    <SidebarProvider defaultOpen>
      <div className="min-h-screen flex w-full">
        <AppSidebar role={role} />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center px-6 gap-4">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold capitalize">{role} Dashboard</h1>
          </header>
          <main className="flex-1 p-6 bg-background overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
