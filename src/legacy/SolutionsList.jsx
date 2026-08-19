import React, { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, X, ExternalLink, Heart, Tag, Calendar } from 'lucide-react'
import useSolutionsStore from '../store/solutionsStore'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import LoadingSkeleton from '../components/ui/LoadingSkeleton'

function SolutionsList() {
  const solutions = useSolutionsStore((state) => state.solutions)
  const toggleFavorite = useSolutionsStore((state) => state.toggleFavorite)
  const favorites = useSolutionsStore((state) => state.favorites)
  const loading = useSolutionsStore((state) => state.loading)
  const error = useSolutionsStore((state) => state.error)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // Get initial values from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [difficultyFilter, setDifficultyFilter] = useState(searchParams.get('difficulty') || 'all')
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest')

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set('search', searchTerm)
    if (selectedTag) params.set('tag', selectedTag)
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (difficultyFilter !== 'all') params.set('difficulty', difficultyFilter)
    if (sortBy !== 'newest') params.set('sort', sortBy)
    
    setSearchParams(params)
  }, [searchTerm, selectedTag, statusFilter, difficultyFilter, sortBy, setSearchParams])

  // Get all unique tags for filter dropdown
  const allTags = [...new Set(solutions.flatMap(solution => solution.tags))].sort()

  // Filter and sort solutions
  let filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.problem_description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         solution.solution_steps?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesTag = !selectedTag || solution.tags.includes(selectedTag)
    const matchesStatus = statusFilter === 'all' || solution.status === statusFilter
    const matchesDifficulty = difficultyFilter === 'all' || solution.difficulty === difficultyFilter

    return matchesSearch && matchesTag && matchesStatus && matchesDifficulty
  })

  // Sort solutions
  filteredSolutions.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at)
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at)
      case 'title':
        return a.title.localeCompare(b.title)
      case 'status':
        return a.status.localeCompare(b.status)
      default:
        return new Date(b.created_at) - new Date(a.created_at)
    }
  })

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedTag('')
    setStatusFilter('all')
    setDifficultyFilter('all')
    setSortBy('newest')
  }

  const hasActiveFilters = searchTerm || selectedTag || statusFilter !== 'all' || difficultyFilter !== 'all' || sortBy !== 'newest'

  if (error) {
    return (
      <div className="p-4 lg:p-6 bg-gray-50 dark:bg-slate-800 min-h-full">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Solutions</h3>
          <p className="text-red-600 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }
  return (
    <div className='p-4 lg:p-6 bg-gray-50 dark:bg-slate-800 min-h-full'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl lg:text-3xl font-bold mb-1 text-gray-900 dark:text-white'>Solutions</h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">Browse and manage your problem-solution documentation</p>
        </div>
        <Link 
          to="add-new"
          className='px-3 lg:px-4 py-2 text-sm lg:text-base text-white bg-blue-600 hover:bg-blue-700 cursor-pointer text-center rounded-lg transition-colors'
        >
          <span className="hidden sm:inline">+ Add New Solution</span>
          <span className="sm:hidden">+ Add</span>
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-slate-900 p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search solutions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 lg:py-3 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Tag Filter */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tag</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full px-2 lg:px-3 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 lg:px-3 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Difficulty</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="w-full px-2 lg:px-3 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 lg:px-3 py-2 text-sm lg:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A-Z</option>
              <option value="status">Status</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end sm:col-span-2 lg:col-span-1">
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="w-full px-2 lg:px-3 py-2 text-sm lg:text-base text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-blue-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedTag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                Tag: {selectedTag}
                <button onClick={() => setSelectedTag('')} className="ml-2 hover:text-green-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="ml-2 hover:text-orange-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {difficultyFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                Difficulty: {difficultyFilter}
                <button onClick={() => setDifficultyFilter('all')} className="ml-2 hover:text-purple-600">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Summary */}
      {!loading && (
      <div className="mb-4">
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-300">
          Showing {filteredSolutions.length} of {solutions.length} solutions
          {hasActiveFilters && ' (filtered)'}
        </p>
      </div>
      )}

      {/* Solutions List */}
      <div>
        {loading ? (
          <LoadingSkeleton type="card" count={5} />
        ) : filteredSolutions.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
            {solutions.length === 0 ? (
              <>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No solutions yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Start documenting your problem-solving journey by creating your first solution.
                </p>
                <Link
                  to="add-new"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create First Solution
                </Link>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No solutions match your filters</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSolutions.map((solution) => (
              <div key={solution.id} className='bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 px-4 lg:px-6 py-4 lg:py-6 rounded-lg shadow-sm hover:shadow-md transition-shadow'>
                <div className='flex justify-between items-start mb-4'>
                  <h2 className='text-lg lg:text-xl font-semibold text-gray-900 dark:text-white pr-4'>{solution.title}</h2>
                    <div className="flex gap-1 lg:gap-2 items-center flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleFavorite(solution.id)
                      }}
                      className={`p-1 lg:p-2 border rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                        favorites.includes(solution.id)
                          ? 'border-red-500 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`size-3 lg:size-4 ${
                        favorites.includes(solution.id) ? 'fill-current' : ''
                      }`} />
                    </button>
                    <span className={`py-1 px-2 lg:px-3 rounded-lg text-xs lg:text-sm font-medium ${
                      solution.status === 'resolved' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    }`}>
                      {solution.status}
                    </span>
                    <span className="hidden sm:inline py-1 px-2 lg:px-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg text-xs lg:text-sm font-medium">
                      {solution.difficulty}
                    </span>
                    <Link to={`/solution/${solution.id}`}>
                      <span className='p-1 lg:p-2 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 cursor-pointer transition-colors'>
                        <ExternalLink className='size-3 lg:size-4'/>
                      </span>
                    </Link>
                  </div>
                </div>
                
                <p className='text-gray-600 dark:text-gray-300 text-sm lg:text-base mb-4'>{solution.description}</p>
                
                <div className='flex flex-wrap gap-2 mb-4'>
                  {solution.tags.map((tag, tagIndex) => (
                    <Link
                      key={tagIndex}
                      to={`/solution?tag=${encodeURIComponent(tag)}`}
                      className='inline-flex items-center text-xs px-2 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer'
                    >
                      <Tag className='size-2 lg:size-3 mr-1'/>
                      {tag}
                    </Link>
                  ))}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className='size-3 lg:size-4 mr-2'/>
                  <span>Created: {new Date(solution.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SolutionsList