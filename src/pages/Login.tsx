import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRequestProgress } from '../components/RequestProgressContext.tsx';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const { show, hide } = useRequestProgress();
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    show();
    try {
      const success = await login(phone, password);
      if (!success) {
        setError('نام کاربری یا رمز عبور اشتباه است.');
      }
      // ریدایرکت بعد از login موفق، توسط useEffect انجام میشه
    } catch (err) {
      setError('خطا در ارتباط با سرور. لطفاً دوباره تلاش کنید.');
      console.error('Login submission error:', err);
    } finally {
      hide();
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full">
        {/* لوگو */}
        <div className="flex justify-center mb-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-20 w-20 object-contain"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          پنل مدیریت
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="موبایل"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <input
            type="password"
            placeholder="کلمه عبور"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Login
          </button>
        </form>

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">{error}</p>
        )}
      </div>
    </div>
  );
}

export default Login;
