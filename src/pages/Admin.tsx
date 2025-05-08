import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Dashboard from '@/components/admin/Dashboard';
import ProductManagement from '@/components/admin/ProductManagement';
import OrderManagement from '@/components/admin/OrderManagement';
import UserManagement from '@/components/admin/UserManagement';
import ContactResponses from '@/components/admin/ContactResponses';
import CustomerSegmentation from '@/components/admin/CustomerSegmentation';
import EmailAutomation from '@/components/admin/EmailAutomation';

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

  return (
    <MainLayout requireAuth requireAdmin>
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex-1 p-6 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
