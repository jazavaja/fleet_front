// src/components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Type for AuthContext value
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth() as AuthContextType;

  // if (loading) {
  if (loading) {
    return <div>Loading authentication...</div>;
  }

  // اگر کاربر احراز هویت شده باشد، به مسیر مورد نظر اجازه دسترسی می‌دهد
  // در غیر این صورت، به صفحه ورود (login) هدایت می‌شود
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;