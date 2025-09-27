import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Tag,
  Calendar,
  ExternalLink,
  BarChart3,
  Activity
} from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function Dashboard() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const loading = useSolutionsStore((state) => state.loading)
  const error = useSolutionsStore((state) => state.error)

   if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome to your developer documentation hub</p>
        </div>
        <LoadingSkeleton type="stats" count={4} />
        <div className="mt-8">
          <LoadingSpinner size="large" text="Loading dashboard data..." />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Dashboard</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }
  
  // Calculate metrics
  const totalSolutions = solutions.length
  const resolvedSolutions = solutions.filter(s => s.status === 'resolved').length
  const openSolutions = solutions.filter(s => s.status === 'open').length
  
  // Get recent solutions (last 5)
  const recentSolutions = solutions
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)
  
  // Get popular tags
  const tagCounts = solutions.reduce((acc, solution) => {
    solution.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})
  
  const popularTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)

  const quickActions = [
    {
      title: "Add New Solution",
      description: "Document a new problem and solution",
      icon: <Plus className="h-6 w-6" />,
      link: "/solution/add-new",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Browse Solutions",
      description: "View all documented solutions",
      icon: <FileText className="h-6 w-6" />,
      link: "/solution",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Manage Tags",
      description: "Organize your solution categories",
      icon: <Tag className="h-6 w-6" />,
      link: "/tags",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "View Favorites",
      description: "Access your starred solutions",
      icon: <TrendingUp className="h-6 w-6" />,
      link: "/favorites",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ]

  return (
    <div className="p-4 lg:p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Welcome back! Here's an overview of your developer documentation.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Solutions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSolutions}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">{resolvedSolutions}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Open Issues</p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{openSolutions}</p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-full">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                {totalSolutions > 0 ? Math.round((resolvedSolutions / totalSolutions) * 100) : 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white p-4 lg:p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105`}
            >
              <div className="flex items-center mb-2 lg:mb-3">
                {action.icon}
                <h3 className="ml-3 font-semibold text-sm lg:text-base">{action.title}</h3>
              </div>
              <p className="text-xs lg:text-sm opacity-90">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Solutions */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Solutions
              </h2>
              <Link 
                to="/solution" 
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-4 lg:p-6">
            {recentSolutions.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No solutions yet</p>
                <Link 
                  to="/solution/add-new"
                  className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                >
                  Create your first solution
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentSolutions.map((solution) => (
                  <div key={solution.id} className="flex items-center justify-between p-2 lg:p-3 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm lg:text-base text-gray-900 dark:text-white truncate">
                        {solution.title}
                      </h3>
                      <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(solution.created_at).toLocaleDateString()}
                        <span className={`ml-3 px-2 py-1 rounded-full text-xs ${
                          solution.status === 'resolved' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                          {solution.status}
                        </span>
                      </div>
                    </div>
                    <Link 
                      to={`/solution/${solution.id}`}
                      className="ml-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Popular Tags */}
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Tag className="h-5 w-5 mr-2" />
              Popular Tags
            </h2>
          </div>
          <div className="p-4 lg:p-6">
            {popularTags.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No tags yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {popularTags.map(([tag, count]) => (
                  <div key={tag} className="flex items-center justify-between flex-wrap gap-2">
                    <span className="inline-flex items-center px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </span>
                    <span className="text-xs lg:text-sm font-medium text-gray-500 dark:text-gray-400">
                      {count} solution{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard