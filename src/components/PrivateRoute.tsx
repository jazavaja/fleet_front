// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth(); // از هوک سفارشی استفاده می‌کنیم

  // اگر هنوز در حال بارگذاری هستیم، چیزی نمایش نمی‌دهیم یا یک لودر نشان می‌دهیم
  if (loading) {
    return <div>Loading authentication...</div>; // می‌توانید یک spinner یا loading component قرار دهید
  }

  // اگر کاربر احراز هویت شده باشد، به مسیر مورد نظر اجازه دسترسی می‌دهد
  // در غیر این صورت، به صفحه ورود (login) هدایت می‌شود
  return isAuthenticated ? <Outlet /> : <Navigate to="/javad" replace />;
};

export default PrivateRoute;