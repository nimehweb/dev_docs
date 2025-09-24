import React from 'react'
import { useState } from 'react'
import AppHeader from '../components/AppHeader'
import AppSidebarHeader from '../components/AppSidebarHeader'
import AppSidebarNav from '../components/AppSidebarNav'
import MainContent from '../components/MainContent'
import DataLoader from '../components/DataLoader'

function UserPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <DataLoader>
      <div className="h-screen flex flex-col lg:grid lg:grid-cols-[16rem_1fr] lg:grid-rows-[auto_1fr] bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        {/* Top-left: Sidebar Header (desktop only) */}
        <AppSidebarHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Top-right: App Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
          <AppHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
        
        {/* Bottom-left: Sidebar Navigation */}
        <AppSidebarNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Bottom-right: Main Content */}
        <div className="flex-1 lg:h-full overflow-auto bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
          <MainContent/>
        </div>
      </div>
    </DataLoader>
    
  )
}

export default UserPage