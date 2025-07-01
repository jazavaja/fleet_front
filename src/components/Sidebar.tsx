import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const activeClass = 'bg-indigo-100 text-indigo-700';

  const navItems = [
    { label: 'داشبورد', path: '/dashboard' }, // مثال: تغییر متن به فارسی
    { label: 'کاربران', path: '/dashboard/users' },
    { label: 'تنظیمات', path: '/dashboard/settings' },
    { label: 'خروج', path: '/dashboard/logout' },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-md p-4 text-right">
      <h2 className="text-2xl font-bold mb-6">پلتفرم ناوگان تجاری</h2> {/* تغییر متن به فارسی */}
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`px-4 py-2 rounded-lg hover:bg-indigo-50 ${
              location.pathname === item.path ? activeClass : 'text-gray-600'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;