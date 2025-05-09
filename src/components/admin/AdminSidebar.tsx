
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  PieChart, 
  Mail, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'users' 
  | 'contacts' 
  | 'segmentation' 
  | 'email';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
}

interface SidebarItem {
  id: AdminTab;
  label: string;
  icon: React.ReactNode;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { signOut } = useAuth();
  const [open, setOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'contacts', label: 'Contact Responses', icon: <MessageSquare size={20} /> },
    { id: 'segmentation', label: 'Customer Segments', icon: <PieChart size={20} /> },
    { id: 'email', label: 'Email Automation', icon: <Mail size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-leaf-700 font-heading">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">OrganicGrocer</p>
      </div>
      
      <nav className="space-y-1 flex-grow">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setOpen(false);
            }}
            className={cn(
              "flex items-center space-x-3 w-full px-3 py-2 rounded-md text-sm transition-colors",
              activeTab === item.id 
                ? "bg-leaf-100 text-leaf-800" 
                : "hover:bg-gray-100 text-gray-700"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="pt-6 border-t border-gray-200 mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => signOut()}
        >
          <LogOut size={20} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  // Mobile sidebar using Sheet component
  return (
    <>
      {/* Mobile sidebar trigger */}
      <div className="md:hidden p-4 flex items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="mr-4">
              <Menu size={20} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      
      {/* Desktop sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block h-full">
        <SidebarContent />
      </div>
    </>
  );
};

export default AdminSidebar;
