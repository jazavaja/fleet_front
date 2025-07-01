import Sidebar from '../components/Sidebar.tsx';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 " dir="rtl">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
      

    </div>
  );
};

export default DashboardLayout;
