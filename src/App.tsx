// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { RequestProgressProvider } from './components/RequestProgressContext.tsx';
// import RequestProgressBar from './components/RequestProgressBar.tsx';

// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';

// console.log("Login:", Login);
// console.log("Dashboard:", Dashboard);

// function App() {
//   return (
//     <RequestProgressProvider>
//       <Router>
//         <RequestProgressBar />
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Routes>
//       </Router>
//     </RequestProgressProvider>
//   );
// }

// export default App;


// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout'; // لایه داشبورد شما
import Dashboard from './pages/Dashboard';
// import Users from './pages/Users'; // یک صفحه مثال دیگر
// import Settings from './pages/Settings'; // یک صفحه مثال دیگر
import Login from './pages/Login'; // صفحه ورود شما
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute را ایمپورت می‌کنیم
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import RequestProgressBar from './components/progress/RequestProgressBar';


function App() {
  return (
    <Router>
      {/* نوار پیشرفت همیشه نمایش داده میشه */}
      <RequestProgressBar />
      <Routes>
        {/* مسیر ورود بدون نیاز به احراز هویت */}
        <Route path="/login" element={<Login />} />

        {/* گروه مسیرهایی که نیاز به احراز هویت دارند */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        {/* مسیر برای خروج (که در سایدبار هم قرار داده بودید) */}
        <Route path="/dashboard/logout" element={<LogoutPage />} /> {/* نیاز به ایجاد LogoutPage دارید */}

        {/* مسیر 404 (اختیاری) */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

// یک کامپوننت ساده برای صفحه خروج
const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate(); // برای هدایت کاربر بعد از خروج

  useEffect(() => {
    logout();
    navigate('/login'); // به صفحه ورود هدایت کنید
  }, [logout, navigate]);

  return <div>Logging out...</div>;
};

export default App;
