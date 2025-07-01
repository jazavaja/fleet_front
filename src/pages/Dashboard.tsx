// src/pages/Dashboard.jsx
import DashboardLayout from '../layouts/DashboardLayout';

const Dashboard = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-gray-600">Welcome to the admin panel.</p>
    </DashboardLayout>
  );
};

export default Dashboard;
