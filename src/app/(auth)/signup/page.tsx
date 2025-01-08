// src/app/signup/page.tsx
"use client"
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Head from "next/head";
import { SignupNav } from "@/components/SignupNav";
import { Footer } from "@/components/Footer";
import DreamscapeIcon from "@/components/DreamscapeIcon";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    const formData = new FormData(e.currentTarget);
    const userData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role")
    };
  
    try {
      // Register user
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Error creating account");
      }
  
      // Add a small delay before signing in
      await new Promise(resolve => setTimeout(resolve, 500));
  
      // After successful registration, sign in automatically
      const signInResult = await signIn("credentials", {
        email: userData.email,
        password: userData.password,
        redirect: false,
      });
  
      if (signInResult?.error) {
        console.error('Sign in error:', signInResult.error);
        setError("Error signing in after registration. Please try signing in manually.");
        router.push('/signin?email=' + encodeURIComponent(userData.email as string));
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Head>
        <title>Sign Up | Dreamscape</title>
      </Head>
      <SignupNav />
      
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-8">
            <div className="w-12 h-12">
              <DreamscapeIcon />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Create your Dreamscape account
          </h1>

          {error && (
            <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Select Role
              </label>
              <select
                id="role"
                name="role"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-600 focus:border-transparent bg-white"
                required
              >
                <option value="">Select a role</option>
                <option value="Organizer">Organizer</option>
                <option value="Co-organizer">Co-organizer</option>
                <option value="Attendee">Attendee</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 rounded border-gray-300 text-violet-600 focus:ring-violet-600"
                required
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link 
                  href="/terms"
                  className="text-violet-600 hover:text-violet-800"
                >
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link 
                  href="/privacy"
                  className="text-violet-600 hover:text-violet-800"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition shadow-md hover:shadow-lg flex items-center justify-center"
            >
              {loading ? "Creating account..." : "Create account"}
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition flex items-center justify-center">
              Sign in with Google
              <Image src="/google-icon.png" alt="Google" width={20} height={20} className="w-5 h-5 mr-2" />
            </button>
          </div>
          
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/signin"
              className="text-violet-600 hover:text-violet-800 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}