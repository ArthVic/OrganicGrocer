
import React from 'react';
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
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const sidebarItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'contacts', label: 'Contact Responses', icon: <MessageSquare size={20} /> },
    { id: 'segmentation', label: 'Customer Segments', icon: <PieChart size={20} /> },
    { id: 'email', label: 'Email Automation', icon: <Mail size={20} /> },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-leaf-700 font-heading">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">OrganicGrocer</p>
      </div>
      
      <nav className="space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
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

      <div className="mt-auto pt-6 border-t border-gray-200 mt-6">
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
};

export default AdminSidebar;
