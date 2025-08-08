'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser } from '../lib/firebase';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  currentPage?: string;
}

export default function Navigation({ currentPage = 'dashboard' }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const navigationItems = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'My Bots', href: '/dashboard', icon: '🤖' },
    { name: 'Analytics', href: '/analytics', icon: '📈' },
    { name: 'Templates', href: '/templates', icon: '📝' },
    { name: 'Integrations', href: '/integrations', icon: '🔗' },
    { name: 'Billing', href: '/billing', icon: '💳' },
  ];

  const userMenuItems = [
    { name: 'Account Settings', href: '/account', icon: '⚙️' },
    { name: 'API Keys', href: '/api-keys', icon: '🔑' },
    { name: 'Help & Support', href: '/support', icon: '❓' },
    { name: 'Logout', href: '#', icon: '🚪', action: 'logout' },
  ];

  const handleUserMenuClick = async (item: any) => {
    if (item.action === 'logout') {
      try {
        await signOutUser();
        router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-500">ChatTooAI</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
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

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-green-600">
                    {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {user?.displayName || user?.email || 'User'}
                </span>
                <span className="text-xs">▼</span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  {userMenuItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        if (item.action) {
                          handleUserMenuClick(item);
                        } else {
                          window.location.href = item.href;
                        }
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-500 transition-colors"
                    >
                      <span className="text-base">{item.icon}</span>
                      <span>{item.name}</span>
                    </button>
                  ))}
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
              {navigationItems.map((item) => (
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
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-green-600">JD</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">John Doe</span>
                </div>
                {userMenuItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 px-3 py-2 text-base text-gray-600 hover:text-green-500 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 