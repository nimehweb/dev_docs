import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, FileText, Heart, Calendar, TrendingUp, Settings, Plus, Eye, Tag, BarChart3 } from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'

function Profile() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const favorites = useSolutionsStore((state) => state.favorites)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  // Theme toggle function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(newTheme)
  }

  // Calculate stats
  const totalSolutions = solutions.length
  const resolvedSolutions = solutions.filter(s => s.status === 'resolved').length
  const openSolutions = solutions.filter(s => s.status === 'open').length
  const favoritesCount = favorites.length
  const successRate = totalSolutions > 0 ? Math.round((resolvedSolutions / totalSolutions) * 100) : 0

  // Get recent solutions (last 5)
  const recentSolutions = solutions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <User className="size-8 text-blue-500" />
          Profile
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your developer documentation overview and preferences
        </p>
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
        {/* Theme Settings */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Settings className="size-5" />
            Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Choose your preferred theme</p>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current theme: <span className="font-medium capitalize">{theme}</span>
            </div>
          </div>
        </div>

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
                      {new Date(solution.date).toLocaleDateString()}
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
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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

export default Profile