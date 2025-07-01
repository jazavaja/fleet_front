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

function App() {
  return (
    <Router>
      <Routes>
        {/* مسیر ورود بدون نیاز به احراز هویت */}
        <Route path="/login" element={<Login />} />

        {/* گروه مسیرهایی که نیاز به احراز هویت دارند */}
        <Route element={<PrivateRoute />}>
          {/* مسیر روت داشبورد */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* مسیرهای فرزند داشبورد */}
          {/* <Route path="/dashboard/users" element={<Users />} /> */}
          {/* <Route path="/dashboard/settings" element={<Settings />} /> */}
          {/* می‌توانید یک Redirect برای روت اصلی (/) به /dashboard یا /login اضافه کنید */}
          
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

// // src/pages/Users.tsx
// const Users = () => {
//     return (
//         <DashboardLayout>
//             <h1 className="text-3xl font-bold text-gray-800 mb-4 text-right">کاربران</h1>
//             <p className="text-gray-600 text-right">لیست کاربران.</p>
//         </DashboardLayout>
//     );
// };

// // src/pages/Settings.tsx
// const Settings = () => {
//     return (
//         <DashboardLayout>
//             <h1 className="text-3xl font-bold text-gray-800 mb-4 text-right">تنظیمات</h1>
//             <p className="text-gray-600 text-right">تنظیمات سیستم.</p>
//         </DashboardLayout>
//     );
// };

export default App;
