import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Go to Homepage
          </Link>
          
          <div className="text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Looking for something specific?
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            <Link
              to="/tailor"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-gray-900 dark:text-white font-medium">Tailor Resume</span>
            </Link>
            
            <Link
              to="/history"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-gray-900 dark:text-white font-medium">View History</span>
            </Link>
            
            <Link
              to="/how-it-works"
              className="flex items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Search className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3" />
              <span className="text-gray-900 dark:text-white font-medium">How It Works</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}