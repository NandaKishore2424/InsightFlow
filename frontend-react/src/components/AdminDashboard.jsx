import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart } from 'react-google-charts';
import axios from 'axios';

export default function AdminDashboard({ setAuthStatus }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState({
    totalFeedback: 0,
    sentimentDistribution: [],
    categoryDistribution: [],
    recentTrend: []
  });
  
  // Filters
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSentiment, setFilterSentiment] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  
  const navigate = useNavigate();
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    
    if (setAuthStatus) {
      setAuthStatus({
        isAuthenticated: false,
        isAdmin: false,
        userEmail: null
      });
    }
    
    navigate('/signin');
  }, [navigate, setAuthStatus]);
  
  // Fetch feedback data with filters and pagination
  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/feedback/admin`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
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
      
    } catch (err) {
      console.error('Error fetching feedback:', err);
      setError('Failed to load feedback data. Please try again.');
      
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [currentPage, filterCategory, filterSentiment, searchTerm, pageSize, handleLogout]);
  
  const fetchAnalytics = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/feedback/analytics`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAnalytics(response.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  }, [handleLogout]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token || userRole !== 'admin') {
      handleLogout();
      return;
    }
    
    fetchFeedback();
    fetchAnalytics();
  }, [fetchFeedback, fetchAnalytics, handleLogout]);
  
  const handleSearch = () => {
    setCurrentPage(1);
    fetchFeedback();
  };
  
  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchFeedback();
  };
  
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  
  const getSentimentBadgeClass = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'negative':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    }
  };

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      case 'negative':
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="15" x2="16" y2="15"></line>
            <line x1="9" y1="9" x2="9.01" y2="9"></line>
            <line x1="15" y1="9" x2="15.01" y2="9"></line>
          </svg>
        );
    }
  };

  // Prepare chart data
  const sentimentChartData = [
    ['Sentiment', 'Count'],
    ...analytics.sentimentDistribution.map(item => [
      item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1),
      parseInt(item.count)
    ])
  ];

  const categoryChartData = [
    ['Category', 'Count'],
    ...analytics.categoryDistribution.map(item => [
      item.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      parseInt(item.count)
    ])
  ];

  const timelineChartData = [
    ['Date', 'Feedback Count'],
    ...analytics.recentTrend.map(item => [
      new Date(item.date).toLocaleDateString(),
      parseInt(item.count)
    ])
  ];

  // Calculate metrics
  const metrics = {
    total: analytics.totalFeedback,
    positive: analytics.sentimentDistribution.find(s => s.sentiment === 'positive')?.count || 0,
    neutral: analytics.sentimentDistribution.find(s => s.sentiment === 'neutral')?.count || 0,
    negative: analytics.sentimentDistribution.find(s => s.sentiment === 'negative')?.count || 0
  };

  const metricsData = [
    {
      label: 'Total Feedback',
      value: metrics.total,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
        </svg>
      ),
      color: 'blue',
      change: '+12%',
      trend: 'up'
    },
    {
      label: 'Positive Feedback',
      value: metrics.positive,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
      color: 'green',
      change: '+8%',
      trend: 'up'
    },
    {
      label: 'Neutral Feedback',
      value: metrics.neutral,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="8" y1="15" x2="16" y2="15"></line>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
      color: 'yellow',
      change: '+2%',
      trend: 'up'
    },
    {
      label: 'Negative Feedback',
      value: metrics.negative,
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M16 16s-1.5-2-4-2-4 2-4 2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
      ),
      color: 'red',
      change: '-5%',
      trend: 'down'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:4rem_4rem] dark:bg-[linear-gradient(to_right,#374151_1px,transparent_1px),linear-gradient(to_bottom,#374151_1px,transparent_1px)] pointer-events-none opacity-30" />
      <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-blue-600/5 dark:bg-blue-600/5 blur-[100px]" />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 dark:bg-blue-600/20">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-400">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    Admin Dashboard
                  </h1>
                </div>
              </div>
              <p className="text-zinc-600 dark:text-zinc-300">
                Comprehensive feedback analytics and sentiment insights
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-zinc-600 dark:text-zinc-300">Live Updates</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metricsData.map((metric, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    {metric.label}
                  </p>
                  <div className="flex items-baseline space-x-3">
                    <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                      {metric.value}
                    </h3>
                    <div className={`inline-flex items-center text-xs font-medium ${
                      metric.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      <svg className={`w-3 h-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                        <polyline points="17 6 23 6 23 12"></polyline>
                      </svg>
                      {metric.change}
                    </div>
                  </div>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                  metric.color === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                  metric.color === 'green' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  metric.color === 'yellow' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {metric.icon}
                </div>
              </div>
              <div className={`absolute bottom-0 left-0 h-1 w-full ${
                metric.color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                metric.color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                metric.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                'bg-gradient-to-r from-red-500 to-red-600'
              }`} />
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Sentiment Distribution */}
          <div className="col-span-1 lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Sentiment Distribution
              </h3>
              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            </div>
            {sentimentChartData.length > 1 && (
              <Chart
                chartType="PieChart"
                data={sentimentChartData}
                options={{
                  colors: ['#22c55e', '#eab308', '#ef4444'],
                  backgroundColor: 'transparent',
                  legend: { 
                    position: 'bottom', 
                    textStyle: { 
                      color: '#71717a', 
                      fontSize: 12 
                    } 
                  },
                  chartArea: { width: '90%', height: '75%' },
                  pieSliceText: 'percentage',
                  pieSliceTextStyle: { color: 'white', fontSize: 12 }
                }}
                width="100%"
                height="280px"
              />
            )}
          </div>

          {/* Category Distribution */}
          <div className="col-span-1 lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Feedback Categories
              </h3>
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
            </div>
            {categoryChartData.length > 1 && (
              <Chart
                chartType="BarChart"
                data={categoryChartData}
                options={{
                  colors: ['#3b82f6'],
                  backgroundColor: 'transparent',
                  legend: { position: 'none' },
                  hAxis: { 
                    textStyle: { color: '#71717a', fontSize: 11 },
                    gridlines: { color: 'transparent' }
                  },
                  vAxis: { 
                    textStyle: { color: '#71717a', fontSize: 11 },
                    gridlines: { color: '#f4f4f5' }
                  },
                  chartArea: { width: '75%', height: '75%' },
                  bar: { groupWidth: '60%' }
                }}
                width="100%"
                height="280px"
              />
            )}
          </div>

          {/* Timeline Chart */}
          <div className="col-span-1 lg:col-span-1 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Feedback Timeline
              </h3>
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
            </div>
            {timelineChartData.length > 1 && (
              <Chart
                chartType="LineChart"
                data={timelineChartData}
                options={{
                  colors: ['#10b981'],
                  backgroundColor: 'transparent',
                  legend: { position: 'none' },
                  hAxis: { 
                    textStyle: { color: '#71717a', fontSize: 11 },
                    gridlines: { color: 'transparent' },
                    format: 'MMM dd'
                  },
                  vAxis: { 
                    textStyle: { color: '#71717a', fontSize: 11 },
                    gridlines: { color: '#f4f4f5' },
                    minValue: 0
                  },
                  chartArea: { width: '80%', height: '75%' },
                  pointSize: 4,
                  lineWidth: 3,
                  curveType: 'function'
                }}
                width="100%"
                height="280px"
              />
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                Feedback Management
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">
                Filter and search through customer feedback
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="h-4 w-4 text-zinc-500 dark:text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search feedback..."
                className="block w-full rounded-md border border-zinc-300 bg-white pl-10 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                handleFilterChange();
              }}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:border-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="praise">Praise</option>
              <option value="complaint">Complaint</option>
              <option value="bug_report">Bug Report</option>
              <option value="feature_request">Feature Request</option>
            </select>

            {/* Sentiment Filter */}
            <select
              value={filterSentiment}
              onChange={(e) => {
                setFilterSentiment(e.target.value);
                handleFilterChange();
              }}
              className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:focus:border-blue-500"
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
              Search
            </button>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-zinc-600 dark:text-zinc-300">Loading feedback data...</p>
              </div>
            </div>
          ) : error ? (
            <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L10 10.586l1.293-1.293a1 1 0 001.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    Error loading feedback
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : feedbackList.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mx-auto h-24 w-24 rounded-full bg-zinc-100 flex items-center justify-center mb-4 dark:bg-zinc-700">
                <svg className="h-12 w-12 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">No feedback found</h3>
              <p className="text-zinc-600 dark:text-zinc-300">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            feedbackList.map((feedback) => (
              <div
                key={feedback.id}
                className="group rounded-xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 dark:border-zinc-700 dark:bg-zinc-800"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getSentimentBadgeClass(feedback.sentiment)}`}>
                        {getSentimentIcon(feedback.sentiment)}
                        {feedback.sentiment.charAt(0).toUpperCase() + feedback.sentiment.slice(1)}
                      </span>
                      
                      <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200">
                        {feedback.category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                      
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        {new Date(feedback.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>

                      {feedback.confidence_score && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {Math.round(feedback.confidence_score * 100)}% confidence
                        </span>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-700">
                        <svg className="h-4 w-4 text-zinc-600 dark:text-zinc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {feedback.name || 'Anonymous User'}
                        </p>
                        {feedback.email && (
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {feedback.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-700/50">
                      <p className="text-sm text-zinc-900 dark:text-zinc-100 leading-relaxed">
                        {feedback.message}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row lg:flex-col gap-2">
                    <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600">
                      <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      Reply
                    </button>
                    <button className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600">
                      <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-zinc-700 dark:text-zinc-300">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
              >
                <svg className="mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"></path>
                </svg>
                Previous
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center justify-center rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600"
              >
                Next
                <svg className="ml-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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