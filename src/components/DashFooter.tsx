import React from 'react';
import Link from 'next/link';
import DreamscapeIcon from './DreamscapeIcon';

export const DashFooter = () => {
  return (
    <footer className="bg-slate-900 text-slate-200 fixed bottom-0 left-0 right-0">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-slate-300 text-sm">
              © {new Date().getFullYear()} Dreamscape
            </span>
            <span className="w-4 h-4 opacity-90">
              <DreamscapeIcon />
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <Link 
              href="/privacy" 
              className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-slate-300 hover:text-white transition-colors duration-200 text-sm"
            >
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};