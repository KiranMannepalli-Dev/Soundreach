import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminRouteGuard: React.FC = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
