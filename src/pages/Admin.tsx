import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Dashboard from '@/components/admin/Dashboard';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import ContactResponses from '@/components/admin/ContactResponses';
import CustomerSegmentation from '@/components/admin/CustomerSegmentation';
import EmailAutomation from '@/components/admin/EmailAutomation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert, LogIn } from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'orders' 
  | 'users' 
  | 'contacts' 
  | 'segmentation' 
  | 'email';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const { user, isAdmin, loading, error, createAdminRole } = useAdminAuth();
  const navigate = useNavigate();

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/auth', { state: { returnUrl: '/admin' } });
  };

  // Handle creating mock admin role for testing
  const handleCreateAdminRole = async () => {
    const { success, error } = await createAdminRole();
    
    if (success) {
      toast.success('Admin role created successfully!');
    } else {
      toast.error(`Failed to create admin role: ${error}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'users':
        return <UserManagement />;
      case 'contacts':
        return <ContactResponses />;
      case 'segmentation':
        return <CustomerSegmentation />;
      case 'email':
        return <EmailAutomation />;
      default:
        return <Dashboard />;
    }
  };

  if (loading) {
    return (
      <MainLayout requireAuth>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-leaf-600" />
            <p className="text-lg">Checking admin privileges...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md p-6 border rounded-lg shadow">
            <LogIn className="h-12 w-12 mx-auto mb-4 text-leaf-600" />
            <h2 className="text-2xl font-bold mb-4">Admin Login Required</h2>
            <p className="mb-6">You need to log in before accessing the admin area.</p>
            <Button onClick={handleLoginRedirect} className="w-full">
              Log In
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isAdmin) {
    return (
      <MainLayout requireAuth>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md p-6 border rounded-lg shadow">
            <ShieldAlert className="h-12 w-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
            <p className="mb-6">Your account doesn't have admin privileges.</p>
            <Button onClick={handleCreateAdminRole} className="w-full mb-4">
              Create Admin Role (For Testing)
            </Button>
            <Button onClick={() => navigate('/')} variant="outline" className="w-full">
              Back to Homepage
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-4 md:p-6 overflow-auto md:ml-64">
          {renderTabContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
