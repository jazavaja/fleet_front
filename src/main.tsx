// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx'; // ایمپورت AuthProvider
import { RequestProgressProvider } from './components/RequestProgressContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RequestProgressProvider>  {/* اینجا */}
        <App />
      </RequestProgressProvider>
    </AuthProvider>
  </React.StrictMode>,
);
