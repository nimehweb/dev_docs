import { useState, useEffect } from "react";
import {
  FileCode,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  FileText,
  Tag,
  Star,
  User,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function AppSidebar({ sidebarOpen, setSidebarOpen }) {
  const [collapsed, setCollapsed] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [sidebarOpen]);

  const navigationLinks = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard className="h-6 w-6" /> },
    { name: "Solutions", path: "/solution", icon: <FileText className="h-6 w-6" /> },
    { name: "Tags", path: "/tags", icon: <Tag className="h-6 w-6" /> },
    { name: "Favorites", path: "/favorites", icon: <Star className="h-6 w-6" /> },
    { name: "Profile", path: "/profile", icon: <User className="h-6 w-6" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" />
      )}
      
      {/* Sidebar */}
    <div
      className={`sidebar fixed lg:relative inset-y-0 left-0 z-50 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 transition-all duration-300 
        ${collapsed ? "w-22" : "w-64"}
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Header */}
      <div className="flex gap-2 justify-between items-center border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2 items-center py-1.75">
          <span className="flex items-center p-2 bg-slate-500 rounded-lg text-white">
            <FileCode className="h-7 w-7 text-white" />
          </span>
          {!collapsed && <p className="font-bold text-lg text-gray-900 dark:text-white">DevDocs</p>}
        </div>
        <div className="flex items-center gap-2">
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Desktop collapse button */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:block cursor-pointer text-xl text-gray-600 dark:text-gray-400"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col space-y-4 p-6">
        {navigationLinks.map((link) => (
          <div key={link.name} className="relative group">
            <NavLink
            to={link.path}
            onClick={() => setSidebarOpen(false)} // Close sidebar on mobile when link is clicked
            className={({ isActive }) =>
              `flex items-center gap-2 transition-colors py-3 px-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isActive ? `font-bold text-blue-600 dark:text-blue-400 ${collapsed ?  '':'bg-slate-100 dark:bg-slate-800'  } ` : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            {link.icon}
            {!collapsed && <span>{link.name}</span>}
            
          </NavLink>
          {collapsed && (
              <span
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2
                  whitespace-nowrap px-2 py-1 text-sm rounded bg-gray-800 text-white
                  dark:bg-gray-200 dark:text-gray-800
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {link.name}
              </span>
            )}
          </div>
            
        ))}
      </div>
    </div>
    </>
  );
}
          onClick={() => setCollapsed((prev) => !prev)}
          className="cursor-pointer text-xl text-gray-600 dark:text-gray-400"
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      {/* Nav Links */}
      <div className="flex flex-col space-y-4 p-6">
        {navigationLinks.map((link) => (
          <div key={link.name} className="relative group">
            <NavLink
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-2 transition-colors py-3 px-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 ${
                isActive ? `font-bold text-blue-600 dark:text-blue-400 ${collapsed ?  '':'bg-slate-100 dark:bg-slate-800'  } ` : "text-gray-600 dark:text-gray-300"
              }`
            }
          >
            {link.icon}
            {!collapsed && <span>{link.name}</span>}
            
          </NavLink>
          {collapsed && (
              <span
                className="absolute left-full top-1/2 -translate-y-1/2 ml-2
                  whitespace-nowrap px-2 py-1 text-sm rounded bg-gray-800 text-white
                  dark:bg-gray-200 dark:text-gray-800
                  opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {link.name}
              </span>
            )}
          </div>
            
        ))}
      </div>
    </div>
  );
}

export default AppSidebar;
