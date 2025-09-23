import React from 'react'
import { Code2 } from 'lucide-react'

function AppSidebarHeader({ sidebarOpen, setSidebarOpen }) {
  return (
    <div className="hidden lg:flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 border-r ">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Code2 className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-gray-900 dark:text-white">DevDocs</span>
      </div>
    </div>
  )
}

export default AppSidebarHeader