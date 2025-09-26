import React from 'react'

function LoadingSkeleton({ type = 'card', count = 3 }) {
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-700 px-6 py-6 rounded-lg shadow-sm animate-pulse">
            <div className="flex justify-between items-start mb-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
              <div className="h-6 w-20 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (type === 'stats') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-slate-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-2"></div>
                <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
              <div className="h-12 w-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default LoadingSkeleton