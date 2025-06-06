import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function SignIn({ setAuthStatus }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [formState, setFormState] = useState({
    error: null,
    loading: false
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setFormState({ error: null, loading: true });
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        formData
      );
      
      const { token, user } = response.data;
      
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      
      // Update auth context
      setAuthStatus({
        isAuthenticated: true,
        isAdmin: user.role === 'admin',
        userEmail: user.email
      });
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    } catch (error) {
      setFormState({
        loading: false,
        error: error.response?.data?.message || 'Failed to sign in. Please check your credentials.'
      });
    }
  };
  
  return (
    <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center px-4">
      <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-50 dark:bg-zinc-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] opacity-40" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-600/10 dark:bg-blue-600/5 blur-[100px]" />
      </div>
      
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-8 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
          {/* Decorative corner elements */}
          <div className="absolute -top-16 -right-16 h-32 w-32 rounded-full bg-blue-100/60 dark:bg-blue-900/30" aria-hidden="true" />
          <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-blue-100/60 dark:bg-blue-900/30" aria-hidden="true" />
          
          <div className="relative space-y-6">
            <div className="space-y-2 text-center">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 p-2 dark:bg-blue-900/50 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600 dark:text-blue-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Welcome back</h1>
              <p className="text-zinc-600 dark:text-zinc-300">
                Sign in to your account to continue
              </p>
            </div>
            
            {successMessage && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 px-4 py-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}
            
            {formState.error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {formState.error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                      <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-blue-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                    Password
                  </label>
                  <Link to="#" className="text-xs text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                      <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-blue-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:focus:ring-offset-zinc-800 dark:focus:ring-blue-400"
                />
                <label htmlFor="remember" className="text-sm text-zinc-600 dark:text-zinc-300">
                  Remember me for 30 days
                </label>
              </div>
              
              <button
                type="submit"
                disabled={formState.loading}
                className="relative inline-flex h-11 w-full items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 hover:shadow-blue-500/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:shadow-blue-800/20 dark:hover:shadow-blue-800/30 dark:focus-visible:ring-blue-400 dark:focus-visible:ring-offset-zinc-800"
              >
                {formState.loading ? (
                  <>
                    <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Don't have an account? </span>
              <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign up for free
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}