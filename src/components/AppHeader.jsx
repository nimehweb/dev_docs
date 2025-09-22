import React, { useEffect, useState } from 'react'
import { UserCircle, Sun, Moon } from 'lucide-react'

function AppHeader() {
  // ✅ Initialize from the HTML <html> element
  const [theme, setTheme] = useState(() => {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
    }
  }, [theme]);

  return (
    <div className="flex justify-between items-center p-6 border-b bg-white border-gray-200 dark:bg-slate-900 dark:border-gray-700">
      <div className="font-bold text-gray-900 text-lg dark:text-white">
        Developer Documentation
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {theme === 'light'
            ? <Moon className="h-6 w-6 text-gray-600" />
            : <Sun className="h-6 w-6 text-yellow-400" />}
        </button>
        <UserCircle className="h-6 w-6 text-gray-500" />
      </div>
    </div>
  )
}

export default AppHeader
