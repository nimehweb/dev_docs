import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tag, Search, Filter, TrendingUp, Hash, FileText } from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'

function Tags() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('count') // 'count', 'name', 'recent'

  // Calculate tag statistics
  const tagStats = solutions.reduce((acc, solution) => {
    solution.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = {
          name: tag,
          count: 0,
          solutions: [],
          lastUsed: solution.date
        }
      }
      acc[tag].count += 1
      acc[tag].solutions.push(solution)
      // Keep track of most recent usage
      if (new Date(solution.date) > new Date(acc[tag].lastUsed)) {
        acc[tag].lastUsed = solution.date
      }
    })
    return acc
  }, {})

  // Convert to array and filter by search term
  let tagList = Object.values(tagStats).filter(tag =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort tags based on selected criteria
  tagList.sort((a, b) => {
    switch (sortBy) {
      case 'count':
        return b.count - a.count
      case 'name':
        return a.name.localeCompare(b.name)
      case 'recent':
        return new Date(b.lastUsed) - new Date(a.lastUsed)
      default:
        return b.count - a.count
    }
  })

  const totalTags = tagList.length
  const totalSolutions = solutions.length
  const averageTagsPerSolution = totalSolutions > 0 ? 
    (solutions.reduce((sum, sol) => sum + sol.tags.length, 0) / totalSolutions).toFixed(1) : 0

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tags & Categories
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Organize and explore your solutions by tags and categories.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tags</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalTags}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Hash className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tagged Solutions</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalSolutions}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Tags/Solution</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{averageTagsPerSolution}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="count">Sort by Usage</option>
              <option value="name">Sort by Name</option>
              <option value="recent">Sort by Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tags Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            All Tags ({tagList.length})
          </h2>
        </div>
        <div className="p-6">
          {tagList.length === 0 ? (
            <div className="text-center py-12">
              <Tag className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No tags found' : 'No tags yet'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {searchTerm 
                  ? `No tags match "${searchTerm}". Try a different search term.`
                  : 'Start creating solutions with tags to see them here.'
                }
              </p>
              {!searchTerm && (
                <Link
                  to="/solution/add-new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Solution
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tagList.map((tag) => (
                <Link
                  key={tag.name}
                  to={`/solution?tag=${encodeURIComponent(tag.name)}`}
                  className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                        <Tag className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {tag.name}
                      </h3>
                    </div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                      {tag.count}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {tag.count} solution{tag.count !== 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Last used: {new Date(tag.lastUsed).toLocaleDateString()}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tags