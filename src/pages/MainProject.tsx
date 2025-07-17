import React from 'react';
import { useNavigate } from 'react-router-dom';

function MainProject() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-indigo-200 px-4">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Welcome to Fleet Core Project</h1>
      <p className="text-lg text-gray-600 mb-8">This is the main entry point for your application.</p>
      <button
        onClick={() => navigate('/login')}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition text-lg shadow"
      >
        Go to Admin Login
      </button>
    </div>
  );
}

export default MainProject;
