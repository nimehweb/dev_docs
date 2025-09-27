import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Calendar, Tag, ExternalLink, Trash2 } from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

function Favorites() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const favorites = useSolutionsStore((state) => state.favorites)
  const toggleFavorite = useSolutionsStore((state) => state.toggleFavorite)
  
  const favoriteSolutions = solutions.filter(solution => favorites.includes(solution.id))
  const loading = useSolutionsStore((state) => state.loading)
  const error = useSolutionsStore((state) => state.error)

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Heart className="size-8 text-red-500" />
            Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Your bookmarked solutions</p>
        </div>
        <LoadingSkeleton type="card" count={3} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
            <Heart className="size-8 text-red-500" />
            Favorites
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Your bookmarked solutions</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Favorites</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Heart className="size-8 text-red-500 fill-current" />
          Favorites
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Your starred solutions for quick access
        </p>
      </div>

      {/* Favorites count */}
      <div className="mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Favorites</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{favoriteSolutions.length}</p>
            </div>
            <Heart className="size-8 text-red-500 fill-current" />
          </div>
        </div>
      </div>

      {/* Favorites List */}
      <div className="space-y-6">
        {favoriteSolutions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            <Heart className="size-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No favorites yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Start marking solutions as favorites by clicking the heart icon when viewing solutions.
            </p>
            <Link
              to="/solution"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Solutions
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteSolutions.map((solution) => (
              <div key={solution.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 px-6 py-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{solution.title}</h2>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => toggleFavorite(solution.id)}
                      className="p-2 border border-red-500 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                      title="Remove from favorites"
                    >
                      <Trash2 className="size-4" />
                    </button>
                    <span className={`py-1 px-3 rounded-lg text-sm font-medium ${
                      solution.status === 'resolved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}>
                      {solution.status}
                    </span>
                    <span className="py-1 px-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium">
                      {solution.difficulty}
                    </span>
                    <Link to={`/solution/${solution.id}`}>
                      <span className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                        <ExternalLink className="size-4"/>
                      </span>
                    </Link>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{solution.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {solution.tags.map((tag, tagIndex) => (
                    <Link
                      key={tagIndex}
                      to={`/solution?tag=${encodeURIComponent(tag)}`}
                      className="inline-flex items-center text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                    >
                      <Tag className="size-3 mr-1"/>
                      {tag}
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="size-4 mr-2"/>
                  <span>Created: {new Date(solution.date).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Favorites