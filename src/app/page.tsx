import Link from "next/link";
import { CalendarDays, Users, Sparkles, ArrowRight, Check } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {/* Hero Section with Enhanced Gradient and Content */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-800 to-violet-900">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] mix-blend-overlay opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
            <span className="inline-block px-4 py-2 rounded-full bg-violet-800/30 text-violet-200 text-sm font-medium mb-6">
              Launching our new AI-powered event planning tools
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Create Extraordinary
              <span className="block bg-gradient-to-r from-violet-200 to-cyan-200 text-transparent bg-clip-text">Events That Inspire</span>
            </h1>
            <p className="text-lg lg:text-xl mb-8 text-violet-100">
              Streamline your event planning process with our intelligent platform. From concept to execution, we make every moment count.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Link 
                href="/signup" // This route exists so it should work
                className="inline-flex items-center justify-center bg-violet-100 text-violet-900 px-8 py-4 rounded-lg font-semibold hover:bg-white transition-all shadow-lg hover:shadow-xl group"
              >
                Start Now
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              {/* Option 1: Change to an existing page */}
              <Link 
                href="/events" // Or another existing route
                className="inline-flex items-center justify-center bg-violet-800/30 border-2 border-violet-200/20 text-violet-100 px-8 py-4 rounded-lg font-semibold hover:bg-violet-800/40 transition-all"
              >
                View Events
              </Link>
              
              {/* Option 2: Make it a button that opens a modal */}
              {/*
              <button 
                onClick={() => setShowDemoModal(true)} // You'll need to add state for this
                className="inline-flex items-center justify-center bg-violet-800/30 border-2 border-violet-200/20 text-violet-100 px-8 py-4 rounded-lg font-semibold hover:bg-violet-800/40 transition-all"
              >
                Watch Demo
              </button>
              */}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Successful Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you manage every aspect of your events with confidence
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-violet-50 to-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-violet-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <CalendarDays className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Smart Planning</h3>
              <p className="text-gray-600 mb-4">
                AI-powered scheduling, automated task management, and intelligent resource allocation.
              </p>
              <ul className="space-y-2">
                {['Timeline automation', 'Budget tracking', 'Vendor management'].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-violet-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-blue-50 to-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Team Collaboration</h3>
              <p className="text-gray-600 mb-4">
                Real-time collaboration tools to keep your entire team aligned and productive.
              </p>
              <ul className="space-y-2">
                {['Real-time updates', 'Role management', 'Team chat'].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-blue-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative p-8 rounded-2xl bg-gradient-to-b from-cyan-50 to-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-cyan-600 p-4 rounded-xl w-16 h-16 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Advanced Analytics</h3>
              <p className="text-gray-600 mb-4">
                Deep insights and analytics to measure and optimize event performance.
              </p>
              <ul className="space-y-2">
                {['Attendance tracking', 'ROI measurement', 'Trend analysis'].map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <Check className="w-5 h-5 text-cyan-600 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}