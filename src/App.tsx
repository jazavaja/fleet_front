import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RequestProgressProvider } from './components/RequestProgressContext.tsx';
import RequestProgressBar from './components/RequestProgressBar.tsx';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

console.log("Login:", Login);
console.log("Dashboard:", Dashboard);

function App() {
  return (
    <RequestProgressProvider>
      <Router>
        <RequestProgressBar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </RequestProgressProvider>
  );
}

export default App;