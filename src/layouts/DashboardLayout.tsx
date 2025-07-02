import Sidebar from '../components/dashboard_admin/Sidebar.tsx';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 " dir="rtl">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
      

    </div>
  );
};

export default DashboardLayout;
