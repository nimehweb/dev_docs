import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  FileText, 
  Tag, 
  Heart, 
  User, 
  LayoutDashboard,
  X
} from 'lucide-react'

function AppSidebarNav({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation()
  
  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'All Solutions',
      href: '/solution',
      icon: FileText,
    },
    {
      name: 'Tags',
      href: '/tags',
      icon: Tag,
    },
    {
      name: 'Favorites',
      href: '/favorites',
      icon: Heart,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
  ]

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Navigation */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
        flex flex-col h-full
      `}>
        {/* Mobile header with close button */}
        <div className="flex lg:hidden items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">DevDocs</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${active 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Developer Documentation
          </div>
        </div>
      </div>
    </>
  )
}

export default AppSidebarNav