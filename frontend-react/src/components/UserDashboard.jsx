import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

export default function UserDashboard({ userEmail }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    positive: 0,
    neutral: 0,
    negative: 0
  });
  
  const navigate = useNavigate();
  const pageSize = 10;

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/feedback/user`,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          },
          params: {
            email: userEmail,
            page: currentPage,
            limit: pageSize,
            category: filterCategory !== 'all' ? filterCategory : undefined,
            sentiment: filterSentiment !== 'all' ? filterSentiment : undefined,
            search: searchTerm || undefined
          }
        }
      );
      
      setFeedbackList(response.data.data || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
      
      // Calculate stats
      const feedbackData = response.data.data || [];
      const newStats = {
        total: feedbackData.length,
        positive: feedbackData.filter(f => f.sentiment === 'positive').length,
        neutral: feedbackData.filter(f => f.sentiment === 'neutral').length,
        negative: feedbackData.filter(f => f.sentiment === 'negative').length
      };
      setStats(newStats);
      
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError(err.response?.data?.message || 'Failed to load feedback. Please try again.');
      
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterCategory, filterSentiment, searchTerm, userEmail, navigate]);

  useEffect(() => {
    if (!userEmail) {
      navigate('/signin');
      return;
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }
    
    // Connect to socket for real-time updates
    const socket = io(process.env.REACT_APP_SOCKET_URL);
    
    // Fetch initial data
    fetchFeedback();
    
    // Listen for real-time updates
    socket.on('newFeedback', (newFeedback) => {
      if (newFeedback.email === userEmail) {
        setFeedbackList(prev => [newFeedback, ...prev.slice(0, pageSize -1)]); // Keep list size manageable
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          [newFeedback.sentiment]: (prev[newFeedback.sentiment] || 0) + 1
        }));
      }
    });
    
    return () => {
      socket.disconnect();
    };
  }, [navigate, userEmail, fetchFeedback, pageSize]);

  useEffect(() => {
    fetchFeedback();
  }, [currentPage, fetchFeedback]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchFeedback();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    navigate('/signin');
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200 dark:from-green-900/30 dark:to-green-800/40 dark:text-green-400 dark:border-green-700/50';
      case 'negative':
        return 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border border-red-200 dark:from-red-900/30 dark:to-red-800/40 dark:text-red-400 dark:border-red-700/50';
      default: // neutral
        return 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border border-amber-200 dark:from-amber-900/30 dark:to-amber-800/40 dark:text-amber-400 dark:border-amber-700/50';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      case 'negative':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="15" x2="16" y2="15"></line>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
    }
  };

  if (loading && feedbackList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-zinc-900 dark:to-slate-800">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 dark:border-blue-500 animate-spin"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-300 dark:border-blue-700 animate-spin opacity-50" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
          </div>
          <p className="text-lg font-medium text-blue-900 dark:text-blue-300">Loading your insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-900 dark:to-slate-800">
      <div className="absolute inset-0 bg-grid-slate-200 opacity-[0.15] dark:bg-grid-slate-700 dark:opacity-[0.1] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-900 dark:from-blue-500 dark:to-indigo-500">
                Your Feedback Dashboard
              </h1>
              <p className="mt-2 text-lg font-medium text-slate-600 dark:text-slate-400">
                Welcome back, <span className="text-blue-700 dark:text-blue-400">{userEmail}</span>
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-1"></div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/feedback')}
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14"></path>
                  <path d="M5 12h14"></path>
                </svg>
                Submit Feedback
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-600 hover:text-slate-900 dark:hover:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:ring-offset-2"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Feedback', value: stats.total, icon: '📊', color: 'blue' },
            { label: 'Positive', value: stats.positive, icon: '😊', color: 'green' },
            { label: 'Neutral', value: stats.neutral, icon: '😐', color: 'amber' },
            { label: 'Negative', value: stats.negative, icon: '😞', color: 'red' }
          ].map((stat, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-2xl border border-slate-200/70 dark:border-zinc-700/70 bg-white dark:bg-zinc-800/80 backdrop-blur-sm bg-opacity-80 p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-${stat.color}-400/20 to-${stat.color}-600/20 dark:from-${stat.color}-700/20 dark:to-${stat.color}-900/20 ring-2 ring-${stat.color}-500/30 dark:ring-${stat.color}-600/30`}>
                    <span className="text-2xl drop-shadow-sm">{stat.icon}</span>
                  </div>
                </div>
                <div className="ml-5">
                  <div className="text-3xl font-bold text-slate-900 dark:text-zinc-100">
                    {stat.value}
                  </div>
                  <div className="text-sm font-medium text-slate-600 dark:text-zinc-400">
                    {stat.label}
                  </div>
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-700`} />
              <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-br from-${stat.color}-400/10 to-${stat.color}-600/10 dark:from-${stat.color}-700/10 dark:to-${stat.color}-900/10 blur-xl`} />
            </div>
          ))}
        </div>

        <div className="mb-8 rounded-2xl border border-slate-200/70 dark:border-zinc-700/70 bg-white dark:bg-zinc-800/80 backdrop-blur-sm bg-opacity-80 p-6 shadow-xl">
          <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-5">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <svg className="h-5 w-5 text-slate-400 dark:text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 dark:border-zinc-600 bg-slate-50/50 dark:bg-zinc-700 pl-12 pr-4 py-3 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 dark:placeholder:text-zinc-400 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none transition-colors duration-200"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-zinc-600 bg-slate-50/50 dark:bg-zinc-700 px-4 py-3 text-slate-700 dark:text-zinc-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value="all" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">All Categories</option>
                <option value="product" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Product</option>
                <option value="service" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Service</option>
                <option value="support" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Support</option>
                <option value="other" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Other</option>
              </select>

              <select
                value={filterSentiment}
                onChange={(e) => setFilterSentiment(e.target.value)}
                className="rounded-xl border border-slate-200 dark:border-zinc-600 bg-slate-50/50 dark:bg-zinc-700 px-4 py-3 text-slate-700 dark:text-zinc-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500 focus:outline-none transition-colors duration-200"
              >
                <option value="all" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">All Sentiments</option>
                <option value="positive" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Positive</option>
                <option value="neutral" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Neutral</option>
                <option value="negative" className="text-zinc-900 dark:text-zinc-100 bg-white dark:bg-zinc-700">Negative</option>
              </select>

              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                Search
              </button>
            </div>
          </form>
        </div>

        {error && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-4 py-2">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="ml-2 font-medium text-white">Error</span>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-700 p-4">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {feedbackList.length === 0 ? (
            <div className="rounded-2xl border border-slate-200/70 dark:border-zinc-700/70 bg-white dark:bg-zinc-800/80 backdrop-blur-sm bg-opacity-80 p-12 text-center shadow-xl">
              <div className="mx-auto h-28 w-28 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-800/40 flex items-center justify-center mb-6 ring-4 ring-white dark:ring-zinc-800 shadow-lg">
                <svg className="h-12 w-12 text-blue-400 dark:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-zinc-100 mb-3">No feedback found</h3>
              <p className="text-slate-600 dark:text-zinc-400 mb-8 max-w-md mx-auto">
                You haven't submitted any feedback yet. Start by sharing your thoughts to help us improve!
              </p>
              <button
                onClick={() => navigate('/feedback')}
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 focus:outline-none"
              >
                Submit Your First Feedback
              </button>
            </div>
          ) : (
            feedbackList.map((feedback) => (
              <div
                key={feedback._id}
                className="group rounded-2xl border border-slate-200/70 dark:border-zinc-700/70 bg-white dark:bg-zinc-800/80 backdrop-blur-sm bg-opacity-80 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium ${getSentimentColor(feedback.sentiment)}`}>
                        {getSentimentIcon(feedback.sentiment)}
                        {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-600 border border-slate-200 dark:border-slate-500 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                        {feedback.category}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400">
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <p className="text-slate-700 dark:text-zinc-300 leading-relaxed text-base">
                      {feedback.message}
                    </p>
                    
                    {feedback.confidence && (
                      <div className="mt-5 flex items-center gap-3">
                        <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                          Confidence Score:
                        </span>
                        <div className="flex-1 bg-slate-200 dark:bg-zinc-700 rounded-full h-2 max-w-md overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${feedback.confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 bg-slate-100 dark:bg-zinc-700 rounded-full px-2 py-1 border border-slate-200 dark:border-zinc-600">
                          {Math.round(feedback.confidence * 100)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 py-2 px-4 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-600 hover:text-slate-900 dark:hover:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"></path>
                </svg>
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-600 bg-white dark:bg-zinc-700 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-300 shadow-sm hover:bg-slate-50 dark:hover:bg-zinc-600 hover:text-slate-900 dark:hover:text-zinc-100 hover:border-slate-300 dark:hover:border-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-zinc-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"></path>
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}