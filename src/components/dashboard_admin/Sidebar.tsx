import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  hasManageNavyType,
  hasManageNavySize,
  hasManageNavyBrand,
  hasManageNavyMain,
  hasManageNavyMehvar,
  hasManageActivityArea,
  // Add the following imports (to be implemented in permissions.ts):
  hasManageUsageTypes,
  hasManageActivityCategories,
  hasManageUserManagement,
} from '../../utils/permissions';

const Sidebar = ({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (open: boolean) => void }) => {
  const location = useLocation();
  const activeClass = 'bg-indigo-100 text-indigo-700';
  const [openMenu, setOpenMenu] = React.useState<string | null>(null); // Which parent menu is open
  const permissions = localStorage.getItem('permissions')
  const userPermissions: string[] = permissions ? JSON.parse(permissions) : [];
  console.log("UserPermission:::"+userPermissions)
  const navItems = [
    { label: 'داشبورد', path: '/dashboard' },
    { label: 'ثبت ناوگان تجاری', path: '', children: [
      { label: 'مدیریت نوع ناوگان', path: '/dashboard/nav-type', permissionCheck: () => hasManageNavyType(userPermissions) },
      { label: 'مدیریت سایز ناوگان', path: '/dashboard/nav-size', permissionCheck: () => hasManageNavySize(userPermissions) },
      { label: 'مدیریت برندهای ناوگان', path: '/dashboard/nav-brand', permissionCheck: () => hasManageNavyBrand(userPermissions) },
      { label: 'مدیریت محور های ناوگان' , path: '/dashboard/nav-mehvar', permissionCheck:()=> hasManageNavyMehvar(userPermissions) },
      { label: ' تجاری مدیریت ناوگان', path: '/dashboard/nav-main', permissionCheck: () => hasManageNavyMain(userPermissions) },
    ]},
    { label: 'ثبت منطقه فعالیت', path: '/dashboard/activity-area', permissionCheck: () => hasManageActivityArea(userPermissions) },
    { label: 'ثبت انواع کاربری', path: '/dashboard/usage-types', permissionCheck: () => hasManageUsageTypes(userPermissions) },
    { label: 'بخش رسته فعالیت', path: '/dashboard/activity-categories', permissionCheck: () => hasManageActivityCategories(userPermissions) },
    { label: 'مدیریت کاربران', path: '',permissionCheck: () => hasManageUserManagement(userPermissions), children: [
      { label: 'کاربران', path: '/dashboard/user-management', permissionCheck: () => hasManageUserManagement(userPermissions) },
      { label: 'گروه‌ها', path: '/dashboard/user-groups', permissionCheck: () => hasManageUserManagement(userPermissions) },
      { label: 'دسترسی‌ها', path: '/dashboard/group-permissions',permissionCheck: () => hasManageUserManagement(userPermissions) },
    ]},
    { label: 'مدیریت درخواست', path: '/dashboard/service-provider-requests' },
    { label: 'گزارشات اکسل', path: '/dashboard/report-excel' }
  ];

  const logoutPath = '/dashboard/logout';
  
  return (
    <aside
      className={`
        w-64 bg-white shadow-md p-4 text-right overflow-y-auto max-h-screen
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
        {navItems
          .filter(item => !item.permissionCheck || item.permissionCheck())
          .map((item) => {
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
                      {item.children
                        .filter(child => !child.permissionCheck || child.permissionCheck())
                        .map((child) => (
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
