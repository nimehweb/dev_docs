'use client'

import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Code2,
  FileText,
  Tag,
  Heart,
  User,
  LayoutDashboard,
  X,
  UserCircle,
  Sun,
  Moon,
  Menu,
  LogOut,
} from 'lucide-react'

import { logoutAction } from '../../actions/auth'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Library', href: '/solution', icon: FileText },
  { name: 'Tags', href: '/tags', icon: Tag },
  { name: 'Favorites', href: '/favorites', icon: Heart },
  { name: 'Profile', href: '/profile', icon: User },
]


const isActive = (pathname: string, href: string) =>
  pathname.startsWith(href)

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') {
      setTheme(saved)
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('dark', 'light')
    root.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  const handleLogout = async () => {
    await logoutAction()
  }

  return (
    <div className="h-screen flex flex-col lg:grid lg:grid-cols-[16rem_1fr] lg:grid-rows-[auto_1fr] bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
      <div className="hidden lg:flex items-center justify-between p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 border-r">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-gray-900 dark:text-white">DevDocs</span>
        </div>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900">
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
              {theme === 'light' ? (
                <Moon className="h-6 w-6 text-gray-600" />
              ) : (
                <Sun className="h-6 w-6 text-white" />
              )}
            </button>
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)}>
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
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          flex flex-col h-full
        `}
      >
        <div className="flex lg:hidden items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
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

        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Developer Documentation
          </div>
        </div>
      </div>

      <div className="flex-1 lg:h-full overflow-auto bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
        {children}
      </div>
    </div>
  )
}
