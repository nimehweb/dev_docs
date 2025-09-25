import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react'
import { UserCircle, Sun, Moon, Menu, LogOut } from 'lucide-react'
import { authAPI } from '../lib/supabase'

function AppHeader({ sidebarOpen, setSidebarOpen }) {
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
  const [menuOpen, setMenuOpen] = useState(false);

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
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const navigate = useNavigate();
  
  async function handleLogout() {
    try {
      await authAPI.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  return (
    <div className="flex justify-between items-center p-4 lg:p-6 border-b bg-white border-gray-200 dark:bg-slate-900 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="font-bold text-gray-900 text-xl lg:text-2xl dark:text-white">
          Developer Documentation
        </div>
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
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <UserCircle className="h-6 w-6 text-gray-500 dark:text-gray-400" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-slate-900 z-50">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-700 w-full text-left"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AppHeader