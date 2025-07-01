// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// یک Context برای مدیریت وضعیت احراز هویت ایجاد می‌کنیم
const AuthContext = createContext(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null); // اطلاعات کاربر وارد شده
  const [loading, setLoading] = useState(true); // وضعیت بارگذاری اولیه

  // تابع برای بررسی وضعیت ورود کاربر از بک‌اند
  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch('http://localhost:8000/api/user/me/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('User not authenticated');
      }

      const data = await response.json();
      setUser(data); // اطلاعات کاربر را ذخیره می‌کنیم
    } catch (error) {
      console.error("User not authenticated", error);
      setUser(null); // کاربر وارد نشده است
      localStorage.removeItem('access_token'); // حذف توکن نامعتبر
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false); // بارگذاری اولیه به پایان رسید
    }
  };

  // تابعی برای ورود کاربر
  const login = async (phone: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phone, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const { access, refresh } = await response.json();
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      await checkAuth(); // بعد از ورود موفق، اطلاعات کاربر را دریافت می‌کنیم
      return true; // ورود موفق
    } catch (error) {
      console.error("Login failed:", error);
      return false; // ورود ناموفق
    }

  };

  // تابعی برای خروج کاربر
  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');

    // ارسال درخواست لغو توکن به سرور (اختیاری)
    const token = localStorage.getItem('access_token');
    fetch('http://localhost:8000/api/logout/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }).catch(err => console.error("Logout request failed", err));
  };

  // هر بار که کامپوننت AuthProvider رندر شود (یا هنگام بارگذاری اولیه) وضعیت احراز هویت را بررسی می‌کنیم
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// هوک سفارشی برای استفاده آسان از AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};