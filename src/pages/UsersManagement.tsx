// src/pages/Dashboard.jsx
import DashboardLayout from '../layouts/DashboardLayout';
import UserForm from './UserForm';

const Dashboard = () => {
    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-700 mb-4">مدیریت کاربران</h1>

            <UserForm />

        </DashboardLayout>
    );
};

export default Dashboard;
