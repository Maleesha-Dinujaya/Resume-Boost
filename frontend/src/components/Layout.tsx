import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Zap, Menu, X } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { token, userEmail, logout } = useAuth();

  const navigation = [
    { name: 'Tailor Resume', href: '/tailor' },
    { name: 'History', href: '/history' },
    { name: 'How It Works', href: '/how-it-works' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <nav className="border-b border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
              <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span>ResumeBoost</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {token ? (
                <div className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  <span>Signed in as {userEmail}</span>
                  <button
                    onClick={logout}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Login
                </Link>
              )}

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              {token ? (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">Signed in as {userEmail}</p>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                >
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
              <Zap className="h-4 w-4" />
              <span className="text-sm">© 2025 ResumeBoost. All rights reserved. 
                <br />  Developed by - 
                <a
                href="https://github.com/Maleesha-Dinujaya"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                Maleesha Dinujaya
              </a></span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                to="/privacy"
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/how-it-works"
                className="text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
              >
                How It Works
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}