import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard, User, Ticket, Heart, Bell, History, Settings,
  Calendar, BarChart3, Users, QrCode, DollarSign, Shield,
  FileText, Menu, X, LogOut, Sun, Moon, ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const sidebarConfigs = {
  user: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/dashboard/bookings', icon: Ticket, label: 'My Bookings' },
    { to: '/dashboard/saved', icon: Heart, label: 'Saved Events' },
    { to: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    { to: '/dashboard/history', icon: History, label: 'Event History' },
    { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ],
  organizer: [
    { to: '/organizer', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/organizer/events', icon: Calendar, label: 'My Events' },
    { to: '/organizer/create', icon: Calendar, label: 'Create Event' },
    { to: '/organizer/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/organizer/attendees', icon: Users, label: 'Attendees' },
    { to: '/organizer/verify', icon: QrCode, label: 'Verify Tickets' },
    { to: '/organizer/revenue', icon: DollarSign, label: 'Revenue' },
    { to: '/organizer/profile', icon: Settings, label: 'Settings' },
  ],
  admin: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/users', icon: Users, label: 'Manage Users' },
    { to: '/admin/organizers', icon: Shield, label: 'Organizers' },
    { to: '/admin/events', icon: Calendar, label: 'Manage Events' },
    { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { to: '/admin/reports', icon: FileText, label: 'Reports' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ],
};

const DashboardLayout = ({ children, type = 'user' }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const links = sidebarConfigs[type] || sidebarConfigs.user;
  const titles = { user: 'User Dashboard', organizer: 'Organizer Panel', admin: 'Admin Panel' };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar - Desktop */}
      <aside className={`hidden lg:flex flex-col fixed h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${collapsed ? 'w-20' : 'w-64'}`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          {!collapsed && (
            <h2 className="font-display font-bold text-lg text-gray-900 dark:text-white">
              {titles[type]}
            </h2>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            <ChevronLeft className={`w-5 h-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${collapsed ? 'justify-center !px-2' : ''}`}
                title={collapsed ? link.label : ''}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-200 dark:border-gray-700 space-y-1">
          <button onClick={toggleTheme} className={`sidebar-link w-full ${collapsed ? 'justify-center !px-2' : ''}`}>
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
          <button onClick={logout} className={`sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${collapsed ? 'justify-center !px-2' : ''}`}>
            <LogOut className="w-5 h-5" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed left-0 top-0 h-full w-72 bg-white dark:bg-gray-800 z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <h2 className="font-display font-bold text-lg">{titles[type]}</h2>
                <button onClick={() => setSidebarOpen(false)}><X className="w-6 h-6" /></button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`sidebar-link ${location.pathname === link.to ? 'sidebar-link-active' : ''}`}
                  >
                    <link.icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">
                Welcome, <span className="font-medium text-gray-900 dark:text-white">{user?.name}</span>
              </span>
              <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
