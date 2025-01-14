"use client"
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { LoginNav } from "@/components/LoginNav";
import { Footer } from "@/components/Footer";
import DreamscapeIcon from "@/components/DreamscapeIcon";
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });
  
      if (result?.error) {
        switch (result.error) {
          case 'Missing credentials':
            setError('Please fill in all fields');
            break;
          case 'User not found':
            setError('No account found with this email');
            break;
          case 'Please sign in with Google':
            setError('This account uses Google Sign In');
            break;
          case 'Invalid credentials':
            setError('Invalid email or password');
            break;
          default:
            setError('An error occurred during sign in');
        }
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    setError('');
    signIn('google', { 
      callbackUrl: '/dashboard',
    }).catch(() => {
      setError('Failed to connect with Google');
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>Sign In | Dreamscape</title>
      </Head>
      <LoginNav />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12">
              <DreamscapeIcon />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Welcome back to Dreamscape
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  name="remember"
                  className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Remember me
                </label>
              </div>
              
              <Link 
                href="/auth/reset-password"
                className="text-sm text-violet-600 hover:text-violet-800"
              >
                Forgot password?
              </Link>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
              <Image src="/google-icon.png" alt="Google" width={20} height={20} className="w-5 h-5 mr-2" />
              Sign in with Google 
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              href="/signup"
              className="text-violet-600 hover:text-violet-800 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}