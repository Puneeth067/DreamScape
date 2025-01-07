import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DreamscapeIcon from './DreamscapeIcon';

export const DashNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({ 
        redirect: true,
        callbackUrl: '/' 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback navigation if signOut fails
      router.push('/');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10">
                <DreamscapeIcon />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
                Dreamscape
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/features" className="text-gray-600 hover:text-indigo-600 transition">
                Features
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-indigo-600 transition">
                About
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-indigo-600 transition">
                Contact
              </Link>
            </div>
          </div>

          {/* Desktop Right Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-indigo-600 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link href="/features" className="block px-3 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              Features
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              About
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg">
              Contact
            </Link>
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-3 py-2 text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg font-medium disabled:opacity-50"
            >
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};