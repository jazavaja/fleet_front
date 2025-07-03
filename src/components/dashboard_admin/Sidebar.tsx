import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const activeClass = 'bg-indigo-100 text-indigo-700';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false); // برای باز/بسته بودن زیرمنو

  const navItems = [
    { label: 'داشبورد', path: '/dashboard' },
    { label: 'ثبت ناوگان تجاری', path: '/dashboard/commercial-fleet' },
    { label: 'ثبت منطقه فعالیت', path: '/dashboard/activity-area' },
    { label: 'ثبت انواع کاربری', path: '/dashboard/usage-types' },
    { label: 'بخش رسته فعالیت', path: '/dashboard/activity-categories' },
    { label: 'مدیریت درخواست', path: '/dashboard/service-provider-requests' },
    // این آیتم والد هست، پس path رو خالی میذاریم
    { label: 'مدیریت کاربران', path: '', children: [
      { label: 'کاربران', path: '/dashboard/user-management' },
      { label: 'گروه‌ها', path: '/dashboard/user-groups' },
      { label: 'دسترسی‌ها', path: '/dashboard/group-permissions' },
    ]},
    { label: 'گزارشات اکسل', path: '/dashboard/report-excel' }
  ];

  const logoutPath = '/dashboard/logout';

  return (
    <>
      {/* دکمه همبرگر موبایل */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-1 right-1 z-50 md:hidden rounded-md text-white shadow-lg btn-hamburger"
        aria-label="باز کردن منو"
      >
        &#9776;
      </button>

      {/* بک‌دراپ موبایل */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-cyan-800 bg-opacity-10 z-40 md:hidden"
          aria-hidden="true"
        />
      )}

      {/* سایدبار */}
      <aside
        className={`
          fixed top-0 right-0 h-screen bg-white shadow-md p-4 text-right
          w-64
          transform
          transition-transform duration-300 ease-in-out
          z-50
          md:relative md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* هدر سایدبار: لوگو و دکمه خروج کنار هم */}
        <div className="mb-6 flex items-center justify-between">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <Link
            to={logoutPath}
            onClick={() => setMobileOpen(false)}
            className="px-3 py-1 rounded-lg hover:bg-red-100 text-red-600 font-semibold"
          >
            خروج
          </Link>

          {/* دکمه بستن منو موبایل */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-md hover:bg-gray-200"
            aria-label="بستن منو"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => {
            // اگر آیتم زیرمجموعه داره (children)
            if (item.children) {
              const isAnyChildActive = item.children.some(c => location.pathname === c.path);
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className={`w-full text-right px-4 py-2 rounded-lg font-semibold flex justify-between items-center
                      ${isAnyChildActive ? activeClass : 'text-gray-600'}
                    `}
                  >
                    {item.label}
                    <span className={`transition-transform duration-300 ${userMenuOpen ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                  </button>
                  {userMenuOpen && (
                    <div className="flex flex-col mr-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          onClick={() => setMobileOpen(false)}
                          className={`px-4 py-1 rounded-lg text-sm block
                            ${location.pathname === child.path ? activeClass : 'text-gray-600 hover:bg-indigo-50'}`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            // اگر آیتم ساده هست
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2 rounded-lg hover:bg-indigo-50 ${
                  location.pathname === item.path ? activeClass : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
