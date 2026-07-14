
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useUser } from '../../context/UserContext';

type AdminLayoutProps = {
  children: ReactNode;
};

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { user, isAuthenticated } = useUser();
  
  // If user is not authenticated or not an admin, redirect to login
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-background min-h-screen flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
