import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white dark:bg-zinc-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20" />
        <div className="absolute inset-0 bg-grid-zinc-900/[0.04] dark:bg-grid-zinc-100/[0.02] [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 backdrop-blur-sm mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5 h-4 w-4">
                    <path d="M12 2v20"></path>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                  Customer-driven insights platform
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
                  Transform feedback into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-500 dark:to-indigo-400">actionable insights</span>
                </h1>
                <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  InsightFlow helps you collect, analyze, and visualize customer feedback using advanced sentiment analysis, giving you the insights you need to improve your products and services.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/feedback" 
                  className="inline-flex h-11 items-center justify-center rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 px-8 text-sm font-medium text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:shadow-blue-800/20 dark:hover:shadow-blue-800/30 dark:focus-visible:ring-blue-500"
                >
                  Submit Feedback
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </Link>
                <Link 
                  to="/signup" 
                  className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white/80 backdrop-blur-sm px-8 text-sm font-medium text-zinc-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950/80 dark:text-zinc-50 dark:hover:bg-zinc-900 dark:focus-visible:ring-zinc-700"
                >
                  Create Account
                </Link>
              </div>
              
              <div className="pt-4 flex items-center">
                <div className="flex -space-x-2">
                  {[
                    'https://randomuser.me/api/portraits/women/12.jpg',
                    'https://randomuser.me/api/portraits/men/32.jpg',
                    'https://randomuser.me/api/portraits/women/45.jpg',
                  ].map((src, index) => (
                    <img
                      key={index}
                      className="inline-block h-8 w-8 rounded-full ring-2 ring-white dark:ring-zinc-900"
                      src={src}
                      alt=""
                    />
                  ))}
                </div>
                <p className="ml-4 text-sm text-zinc-600 dark:text-zinc-400">
                  Trusted by <span className="font-semibold text-zinc-900 dark:text-zinc-50">2,000+</span> businesses
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-10 dark:from-blue-900/20 dark:to-indigo-900/20" />
                <img 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                  alt="Analytics dashboard" 
                  className="w-full object-cover aspect-[4/3] md:aspect-[16/10]"
                />
                
                {/* Floating stats card */}
                <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/20 bg-white/90 backdrop-blur-sm p-4 dark:border-zinc-700/50 dark:bg-zinc-900/90">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">98%</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">2.3s</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Analysis Time</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">50K+</div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">Processed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative dots */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100 dark:bg-blue-900/20 rounded-full grid grid-cols-3 grid-rows-3 place-items-center gap-2 p-2" aria-hidden="true">
                {[...Array(9)].map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-600/60 dark:bg-blue-400/60"></span>
                ))}
              </div>
              
              {/* Decorative ring */}
              <div className="absolute -top-8 -right-8 w-24 h-24 border-4 border-dashed border-blue-200 dark:border-blue-900/30 rounded-full" aria-hidden="true"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features section with cards */}
      <section className="py-20 bg-zinc-50/50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center p-1 rounded-full bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 backdrop-blur-sm mb-4">
              <span className="px-3 py-0.5 text-xs font-semibold">Intelligent Processing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              How InsightFlow Works
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Our intelligent platform processes feedback and delivers insights in real-time, helping you make data-driven decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-blue-600 dark:text-blue-500">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                ),
                title: "Submit Feedback",
                description: "Users share their thoughts through our intuitive feedback form, designed for maximum engagement and ease of use."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-blue-600 dark:text-blue-500">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m4.93 4.93 4.24 4.24"></path>
                    <path d="m14.83 9.17 4.24-4.24"></path>
                    <path d="m14.83 14.83 4.24 4.24"></path>
                    <path d="m9.17 14.83-4.24 4.24"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                ),
                title: "AI Analysis",
                description: "Advanced sentiment analysis algorithms process each piece of feedback to understand emotional context and meaning."
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-12 w-12 text-blue-600 dark:text-blue-500">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <path d="M9 9h6v6H9z"></path>
                    <path d="m9 1 3 3 3-3"></path>
                  </svg>
                ),
                title: "Actionable Insights",
                description: "Get comprehensive reports and visualizations that help you understand trends and make informed business decisions."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="relative z-10">
                    <div className="mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-blue-100/50 dark:bg-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics section */}
      <section className="py-16 bg-white dark:bg-zinc-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "2K+", label: "Active Users" },
              { value: "98%", label: "Satisfaction Rate" },
              { value: "50K+", label: "Feedback Analyzed" },
              { value: "24/7", label: "Real-time Updates" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.08] dark:bg-grid-white/[0.05]" aria-hidden="true" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-grid-white/[0.08] dark:bg-grid-white/[0.05]" aria-hidden="true" />
        <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl" aria-hidden="true" />
        <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-white opacity-10 blur-2xl" aria-hidden="true" />
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
              Ready to transform your feedback into insights?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of businesses who use InsightFlow to understand their customers better and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-blue-700 shadow-lg shadow-blue-900/20 hover:shadow-blue-900/30 transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700"
              >
                Get Started
                <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
              <Link 
                to="/feedback" 
                className="inline-flex h-12 items-center justify-center rounded-md border border-blue-300/50 px-8 text-sm font-medium text-white hover:bg-blue-700/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue-700 transition-colors"
              >
                Try Demo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}