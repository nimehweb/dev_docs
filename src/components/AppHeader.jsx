import React, { useEffect, useState } from 'react'
import { UserCircle, Sun, Moon } from 'lucide-react'

function AppHeader() {
  // Initialize theme from localStorage or default to light
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      // Check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove both classes first to ensure clean state
    root.classList.remove('dark', 'light');
    
    // Add the current theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
    
    // Save theme preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
    
    console.log('Theme changed to:', theme, 'Classes:', root.classList.toString());
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };

  return (
    <div className="flex justify-between items-center p-6 border-b bg-white border-gray-200 dark:bg-slate-900 dark:border-gray-700">
      <div className="font-bold text-gray-900 text-lg dark:text-white">
        Developer Documentation
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light'
            ? <Moon className="h-6 w-6 text-gray-600" />
            : <Sun className="h-6 w-6 text-yellow-400" />}
        </button>
        <UserCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  )
}

export default AppHeader