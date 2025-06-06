import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function FeedbackForm({ userEmail }) {
  const [formData, setFormData] = useState({
    name: '',
    email: userEmail || '',
    message: '',
    category: 'general'
  });
  
  const [formState, setFormState] = useState({
    errors: {},
    loading: false,
    success: false,
    error: null
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update email when userEmail prop changes
  useEffect(() => {
    if (userEmail) {
      setFormData(prev => ({ ...prev, email: userEmail }));
    }
  }, [userEmail]);
  
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
    
    if (!formData.message.trim()) {
      errors.message = 'Feedback message is required';
    }
    
    if (!userEmail && formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormState(prev => ({ ...prev, errors }));
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormState(prev => ({ 
      ...prev, 
      loading: true, 
      success: false, 
      error: null 
    }));
    
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/feedback/submit`,
        {
          name: formData.name.trim() || null,
          email: formData.email.trim() || null,
          message: formData.message.trim(),
          category: formData.category
        },
        { 
          headers: { 
            'Content-Type': 'application/json',
            ...(userEmail && { 'Authorization': `Bearer ${localStorage.getItem('token')}` })
          } 
        }
      );
      
      setFormState(prev => ({ 
        ...prev, 
        loading: false, 
        success: true 
      }));
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: userEmail || '',
        message: '',
        category: 'general'
      });
      
      // Redirect to dashboard if user is logged in
      if (userEmail && location.pathname !== '/') {
        setTimeout(() => {
          navigate('/user/dashboard');
        }, 2000);
      }
      
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 'Failed to submit feedback. Please try again.'
      }));
    }
  };
  
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-50 dark:bg-zinc-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] opacity-40" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-600/10 dark:bg-blue-600/5 blur-[100px]" />
      </div>
      
      <div className="w-full max-w-2xl">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-800">
          {/* Header */}
          <div className="border-b border-zinc-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-6 dark:border-zinc-700 dark:from-blue-900/20 dark:to-indigo-900/20">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600/10 dark:bg-blue-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600 dark:text-blue-400">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Share Your Feedback
                </h1>
                <p className="text-zinc-600 dark:text-zinc-300">
                  Help us improve by sharing your thoughts and experiences
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-8">
            {/* Success Message */}
            {formState.success && (
              <div className="mb-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                      Thank you for your feedback!
                    </h3>
                    <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                      <p>Your feedback has been successfully submitted and will help us improve our services.</p>
                      {userEmail && (
                        <p className="mt-1">Redirecting to your dashboard...</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {formState.error && (
              <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-500 dark:text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 10.586l1.293-1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                      Error submitting feedback
                    </h3>
                    <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                      <p>{formState.error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                    Name {!userEmail && <span className="text-zinc-500 dark:text-zinc-400">(Optional)</span>}
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
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-zinc-300 bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400 dark:focus-visible:ring-blue-400"
                      placeholder="Your name"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                    Email {!userEmail && <span className="text-zinc-500 dark:text-zinc-400">(Optional)</span>}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                        <path d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!!userEmail}
                      className={`flex h-10 w-full rounded-md border ${formState.errors.email ? 'border-red-400 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'} bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400`}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {formState.errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.email}</p>
                  )}
                </div>
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-zinc-500 dark:text-zinc-400">
                      <path d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                  </div>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-zinc-300 bg-white pl-10 px-3 py-2 text-sm text-zinc-900 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:focus-visible:ring-blue-400"
                  >
                    <option value="general" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">General Feedback</option>
                    <option value="complaint" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Complaint</option>
                    <option value="praise" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Praise</option>
                    <option value="feature_request" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Feature Request</option>
                    <option value="bug_report" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Bug Report</option>
                    <option value="suggestion" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Suggestion</option>
                  </select>
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-100">
                  Your Feedback <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`flex min-h-[120px] w-full rounded-md border ${formState.errors.message ? 'border-red-400 dark:border-red-600 focus-visible:ring-red-500 dark:focus-visible:ring-red-400' : 'border-zinc-300 dark:border-zinc-600 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400'} bg-white px-3 py-2 text-sm text-zinc-900 ring-offset-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-offset-zinc-800 dark:placeholder:text-zinc-400 resize-none`}
                  placeholder="Share your thoughts, suggestions, or concerns. Your feedback helps us improve our services..."
                />
                {formState.errors.message && (
                  <p className="text-sm text-red-600 dark:text-red-400">{formState.errors.message}</p>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-500 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                      Privacy & AI Analysis
                    </h3>
                    <div className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                      <p>
                        Your feedback will be analyzed using AI for sentiment detection to help us better understand and respond to your needs. 
                        Personal information is protected and only used to improve our services.
                      </p>
                    </div>
                  </div>
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
                    Analyzing & Submitting...
                  </>
                ) : (
                  <>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                    Submit Feedback
                  </>
                )}
              </button>
            </form>

            {/* Additional Actions */}
            <div className="text-center pt-4 border-t border-zinc-200 dark:border-zinc-600">
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
                Have a technical issue? Need immediate support?
              </p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                >
                  Contact Support
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}