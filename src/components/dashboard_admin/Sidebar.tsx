import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) => {
  const location = useLocation();
  const activeClass = 'bg-indigo-100 text-indigo-700';
  const [openMenu, setOpenMenu] = React.useState<string | null>(null); // Which parent menu is open

  const navItems = [
    { label: 'داشبورد', path: '/dashboard' },
    { label: 'ثبت ناوگان تجاری', path: '', children: [
      { label: 'مدیریت نوع ناوگان', path: '/dashboard/nav-type' },
      { label: 'مدیریت سایز ناوگان', path: '/dashboard/nav-size' },
      { label: 'مدیریت برندهای ناوگان', path: '/dashboard/nav-brand' },
      { label: 'مدیریت محور های ناوگان' , path: '/dashboard/nav-mehvar'},
      { label: ' تجاری مدیریت ناوگان', path: '/dashboard/nav-main' },
    ]},
    { label: 'ثبت منطقه فعالیت', path: '/dashboard/activity-area' },
    { label: 'ثبت انواع کاربری', path: '/dashboard/usage-types' },
    { label: 'بخش رسته فعالیت', path: '/dashboard/activity-categories' },
    { label: 'مدیریت کاربران', path: '', children: [
      { label: 'کاربران', path: '/dashboard/user-management' },
      { label: 'گروه‌ها', path: '/dashboard/user-groups' },
      { label: 'دسترسی‌ها', path: '/dashboard/group-permissions' },
    ]},
    { label: 'مدیریت درخواست', path: '/dashboard/service-provider-requests' },
    { label: 'گزارشات اکسل', path: '/dashboard/report-excel' }
  ];

  const logoutPath = '/dashboard/logout';

  return (
    <aside
      className={`
        w-64 bg-white shadow-md p-4 text-right
        ${mobileOpen ? 'block fixed top-0 right-0 h-screen z-50' : 'hidden md:block'}
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
          if (item.children) {
            const isAnyChildActive = item.children.some(c => location.pathname === c.path);
            const isOpen = openMenu === item.label;
            return (
              <div key={item.label}>
                <button
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className={`w-full text-right px-4 py-2 rounded-lg font-semibold flex justify-between items-center
                    ${isAnyChildActive ? activeClass : 'text-gray-600'}
                  `}
                >
                  {item.label}
                  <span className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                    ▶
                  </span>
                </button>
                {isOpen && (
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
  );
};

export default Sidebar;
