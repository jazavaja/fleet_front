import React, { useState } from 'react';
import Sidebar from '../components/dashboard_admin/Sidebar.tsx';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-gray-50" dir="rtl">
      {/* Hamburger button for mobile */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-2 right-2 z-50 md:hidden bg-indigo-600 text-white p-2 rounded shadow"
        aria-label="باز کردن منو"
      >
        &#9776;
      </button>
      {/* Overlay for mobile when sidebar is open */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-20 z-40 md:hidden"
          aria-hidden="true"
        />
      )}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <main className="flex-1 p-6 pt-16 md:pt-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
