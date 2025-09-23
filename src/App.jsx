import { useState } from 'react'
import AppHeader from './components/AppHeader'
import AppSidebar from './components/AppSidebar'
import MainContent from './components/MainContent'
import { BrowserRouter as Router } from 'react-router-dom'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  return (
    <Router>
   <div className="h-screen flex lg:grid lg:grid-cols-[auto_1fr] bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
    <AppSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
    <div className="flex-1 grid grid-rows-[auto_1fr] h-full overflow-hidden">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 ">
        <AppHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <div className="h-full overflow-auto bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        <MainContent/>
      </div>
    </div>
   </div>
  </Router>
  )
}

export default App
