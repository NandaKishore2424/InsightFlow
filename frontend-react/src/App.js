import React, { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';

// Lazy-loaded components
const FeedbackForm = lazy(() => import('./components/FeedbackForm'));
const SignIn = lazy(() => import('./components/SignIn'));
const SignUp = lazy(() => import('./components/SignUp'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-zinc-900 dark:to-slate-800">
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-500 animate-spin"></div>
        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-300 dark:border-blue-700 animate-spin opacity-50" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
      </div>
      <p className="text-lg font-medium text-blue-900 dark:text-blue-300">Loading...</p>
    </div>
  </div>
);

function App() {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    isAdmin: false,
    userEmail: null
  });
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');
    
    if (token) {
      setAuthStatus({
        isAuthenticated: true,
        isAdmin: userRole === 'admin',
        userEmail
      });
    }
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setAuthStatus({
      isAuthenticated: false,
      isAdmin: false,
      userEmail: null
    });
  };
  
  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!authStatus.isAuthenticated) {
      return <Navigate to="/signin" replace />;
    }
    
    if (adminOnly && !authStatus.isAdmin) {
      return <Navigate to="/user/dashboard" replace />;
    }
    
    return children;
  };
  
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-zinc-950">
        <Navbar 
          authStatus={authStatus} 
          handleLogout={handleLogout}
        />
        
        <main>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/feedback" element={<FeedbackForm userEmail={authStatus.userEmail} />} />
              <Route path="/signin" element={<SignIn setAuthStatus={setAuthStatus} />} />
              <Route path="/signup" element={<SignUp setAuthStatus={setAuthStatus} />} />
              <Route 
                path="/user/dashboard" 
                element={
                  <ProtectedRoute>
                    <UserDashboard userEmail={authStatus.userEmail} />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard setAuthStatus={setAuthStatus} />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </Suspense>
        </main>
        
        <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 py-6">
          <div className="container mx-auto px-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <p>© 2025 InsightFlow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
