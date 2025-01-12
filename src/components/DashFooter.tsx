import React from 'react';
import Link from 'next/link';
import DreamscapeIcon from './DreamscapeIcon';

export const DashFooter = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md text-gray-600 border-t border-gray-100 bottom-0 left-0 right-0 shadow-lg">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Dreamscape
            </span>
            <span className="w-4 h-4">
              <DreamscapeIcon />
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-gray-500 hover:text-purple-600 transition-colors duration-200 text-sm font-medium"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-500 hover:text-purple-600 transition-colors duration-200 text-sm font-medium"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};