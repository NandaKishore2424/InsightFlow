import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SignUp({ setAuthStatus }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default to user
  });
  
  const [formState, setFormState] = useState({
    errors: {},
    loading: false,
    serverError: null
  });
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (formState.errors[name]) {
      setFormState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [name]: null
        }
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormState(prev => ({ ...prev, loading: true, serverError: null }));
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }
      );
      
      // Automatically log in the user after signup
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userEmail', user.email);
      
      // Update auth status in App component
      if (setAuthStatus) {
        setAuthStatus({
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
          userEmail: user.email
        });
      }
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
      
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        serverError: error.response?.data?.message || 'Failed to create account. Please try again.'
      }));
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Create your account</h1>
              <p className="text-zinc-600 dark:text-zinc-300">
                Join InsightFlow to start collecting valuable feedback
              </p>
            </div>
            
            {formState.serverError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-md text-sm">
                {formState.serverError}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                  <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    className={`flex h-10 w-full rounded-md border ${formState.errors.name ? 'border-red-400 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'} bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400`}
                    placeholder="John Doe"
                  />
                </div>
                {formState.errors.name && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.name}</p>
                )}
              </div>
              
              {/* Email Field */}
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
                    className={`flex h-10 w-full rounded-md border ${formState.errors.email ? 'border-red-400 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'} bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400`}
                    placeholder="you@example.com"
                  />
                </div>
                {formState.errors.email && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.email}</p>
                )}
              </div>

              {/* Role Selection - Made more prominent */}
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Account Type <span className="text-blue-600 dark:text-blue-400">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:focus-visible:ring-blue-400"
                  >
                    <option value="user" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">
                      User - Submit & Track Feedback
                    </option>
                    <option value="admin" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">
                      Admin - Manage All Feedback
                    </option>
                  </select>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formData.role === 'user' 
                    ? '• Submit feedback and view your submissions • Access user dashboard'
                    : '• View and manage all feedback • Access admin analytics • Sentiment analysis tools'
                  }
                </p>
              </div>
              
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Password
                </label>
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
                    autoComplete="new-password"
                    className={`flex h-10 w-full rounded-md border ${formState.errors.password ? 'border-red-400 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'} bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400`}
                    placeholder="••••••••"
                  />
                </div>
                {formState.errors.password && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.password}</p>
                )}
              </div>
              
              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    className={`flex h-10 w-full rounded-md border ${formState.errors.confirmPassword ? 'border-red-400 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'} bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400`}
                    placeholder="••••••••"
                  />
                </div>
                {formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.confirmPassword}</p>
                )}
              </div>
              
              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <div className="flex h-5 items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-600 dark:border-zinc-600 dark:bg-zinc-700 dark:focus:ring-offset-zinc-800"
                  />
                </div>
                <div className="text-sm">
                  <label htmlFor="terms" className="text-sm text-zinc-600 dark:text-zinc-300">
                    I agree to the{' '}
                    <Link to="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="#" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>
              
              {/* Submit Button */}
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
                    Creating account...
                  </>
                ) : (
                  <>
                    Create {formData.role === 'admin' ? 'Admin' : 'User'} Account
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center text-sm">
              <span className="text-zinc-600 dark:text-zinc-300">Already have an account? </span>
              <Link to="/signin" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}