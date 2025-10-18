import React from 'react'
import { Link } from 'react-router-dom'
import { Tag, FileText } from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'

function Tags() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const loading = useSolutionsStore((state) => state.loading)
  const error = useSolutionsStore((state) => state.error)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('count') // 'count', 'name', 'recent'

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Tag className="size-8 text-purple-500" />
            Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Organize your solutions by tags</p>
        </div>
        <LoadingSpinner size="large" text="Loading tags..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Tag className="size-8 text-purple-500" />
            Tags
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Organize your solutions by tags</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Tags</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }
  // Calculate tag statistics
  const tagStats = solutions.reduce((acc, solution) => {
    solution.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1
    })
    return acc
  }, {})

  const sortedTags = Object.entries(tagCounts)
    .sort(([,a], [,b]) => b - a)

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Tag className="size-8 text-purple-500" />
          Tags
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Organize your solutions by tags ({sortedTags.length} tags)
        </p>
      </div>

      {/* Tags Grid */}
      <div>
        {sortedTags.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Tag className="size-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tags yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Tags will appear here as you add them to your solutions.
            </p>
            <Link
              to="/solution/add-new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create First Solution
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedTags.map(([tag, count]) => (
              <Link
                key={tag}
                to={`/solution?tag=${encodeURIComponent(tag)}`}
                className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 p-6 rounded-lg shadow-sm hover:shadow-md transition-all hover:border-purple-300 dark:hover:border-purple-600 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Tag className="size-8 text-purple-500 group-hover:text-purple-600" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{count}</span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                  {tag}
                </h3>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <FileText className="size-4 mr-2" />
                  <span>{count} solution{count !== 1 ? 's' : ''}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Tags