import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MainLayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  requireAuth = false,
  requireAdmin = false 
}) => {
  const { user, loading } = useAuth();

  // Show loading indicator
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-leaf-600"></div>
        </main>
        <Footer />
      </div>
    );
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    toast.error("You must be logged in to access this page");
    return <Navigate to="/auth" />;
  }

  // If admin access is required, check if user is logged in
  if (requireAdmin && !user) {
    toast.error("You must be logged in to access the admin panel");
    return <Navigate to="/auth" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default MainLayout;
