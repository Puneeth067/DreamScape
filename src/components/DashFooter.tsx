import React from 'react';
import Link from 'next/link';
import { Github } from 'lucide-react';
import DreamscapeIcon from './DreamscapeIcon';

export const DashFooter = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Dreamscape
              </span>
              <span className="w-5 h-5">
                <DreamscapeIcon />
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-indigo-600 transition text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-indigo-600 transition text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};