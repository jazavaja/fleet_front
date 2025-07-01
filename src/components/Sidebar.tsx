import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const activeClass = 'bg-indigo-100 text-indigo-700';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/dashboard/users' },
    { label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-white shadow-md p-4">
      <h2 className="text-2xl font-bold mb-6">Fleet Core</h2>
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
