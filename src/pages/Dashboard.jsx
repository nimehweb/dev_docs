import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Heart, Calendar, TrendingUp, Plus, Eye, Tag, ChartBar as BarChart3, User } from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

function Dashboard() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const favorites = useSolutionsStore((state) => state.favorites)
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

  // Calculate stats
  const totalSolutions = solutions.length
  const resolvedSolutions = solutions.filter(s => s.status === 'resolved').length
  const openSolutions = solutions.filter(s => s.status === 'open').length
  const favoritesCount = favorites.length
  const successRate = totalSolutions > 0 ? Math.round((resolvedSolutions / totalSolutions) * 100) : 0

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
    .slice(0, 6)

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Welcome to your developer documentation hub</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Solutions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSolutions}</p>
            </div>
            <FileText className="size-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{resolvedSolutions}</p>
            </div>
            <TrendingUp className="size-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Favorites</p>
              <p className="text-2xl font-bold text-red-600">{favoritesCount}</p>
            </div>
            <Heart className="size-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">{successRate}%</p>
            </div>
            <BarChart3 className="size-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/solution/add-new"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Plus className="size-5 text-blue-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Add Solution</span>
            </Link>
            
            <Link
              to="/solution"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Eye className="size-5 text-green-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">View All</span>
            </Link>
            
            <Link
              to="/favorites"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Heart className="size-5 text-red-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Favorites</span>
            </Link>
            
            <Link
              to="/tags"
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
            >
              <Tag className="size-5 text-purple-500" />
              <span className="font-medium text-gray-700 dark:text-gray-300">Manage Tags</span>
            </Link>
          </div>
        </div>

        {/* Recent Solutions */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Solutions</h3>
          
          {recentSolutions.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No solutions created yet.</p>
          ) : (
            <div className="space-y-3">
              {recentSolutions.map((solution) => (
                <Link
                  key={solution.id}
                  to={`/solution/${solution.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {solution.title}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="size-3" />
                      {new Date(solution.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    solution.status === 'resolved' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {solution.status}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Popular Tags */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Popular Tags</h3>
          
          {popularTags.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No tags used yet.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {popularTags.map(([tag, count]) => (
                <Link
                  key={tag}
                  to={`/solution?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300 transition-colors"
                >
                  <Tag className="size-3" />
                  {tag}
                  <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">({count})</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard