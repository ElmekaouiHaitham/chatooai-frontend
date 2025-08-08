'use client';

import { useState, useEffect, useRef } from 'react';
import { signOutUser } from '../lib/firebase';
import { useRouter } from 'next/navigation';

interface AdminNavigationProps {
  currentPage?: string;
}

export default function AdminNavigation({ currentPage = 'dashboard' }: AdminNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const adminNavigationItems = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Plans', href: '/admin/plans', icon: '💳' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
    { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try {
      setIsLoggingOut(true);
      await signOutUser();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
      // Still redirect to login page even if there's an error
      router.push('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/admin" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-500">ChatTooAI</span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">ADMIN</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {adminNavigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === item.name.toLowerCase()
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </a>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-green-500 transition-colors">
              <span className="text-lg">🔔</span>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* Admin User Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-red-600">A</span>
                </div>
                <span className="text-sm font-medium">Admin</span>
                <span className="text-xs">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <a
                    href="/admin/profile"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-500 transition-colors"
                  >
                    <span className="text-base">👤</span>
                    <span>Admin Profile</span>
                  </a>
                  <a
                    href="/admin/system"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-500 transition-colors"
                  >
                    <span className="text-base">🔧</span>
                    <span>System Settings</span>
                  </a>
                  <a
                    href="/admin/logs"
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-500 transition-colors"
                  >
                    <span className="text-base">📋</span>
                    <span>Logs</span>
                  </a>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-base">🚪</span>
                    <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
            >
              <span className="text-xl">☰</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {adminNavigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    currentPage === item.name.toLowerCase()
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-600 hover:text-green-500 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </a>
              ))}
              
              {/* Mobile User Menu */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-red-600">A</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Admin</span>
                </div>
                <a
                  href="/admin/profile"
                  className="flex items-center space-x-3 px-3 py-2 text-base text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">👤</span>
                  <span>Admin Profile</span>
                </a>
                <a
                  href="/admin/system"
                  className="flex items-center space-x-3 px-3 py-2 text-base text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">🔧</span>
                  <span>System Settings</span>
                </a>
                <a
                  href="/admin/logs"
                  className="flex items-center space-x-3 px-3 py-2 text-base text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
                >
                  <span className="text-lg">📋</span>
                  <span>Logs</span>
                </a>
                <div className="border-t border-gray-200 my-2"></div>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center space-x-3 px-3 py-2 text-base text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg">🚪</span>
                  <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 