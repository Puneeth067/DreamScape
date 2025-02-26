import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Star,
  TrendingUp,
  Shield,
  Globe
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const STATS = [
  { label: "Active Users", value: "10,000+" },
  { label: "Events Managed", value: "50,000+" },
  { label: "Success Rate", value: "99.9%" },
  { label: "Countries", value: "30+" },
];

const TESTIMONIALS = [
  {
    quote: "This platform transformed how we manage our corporate events. The AI features are game-changing.",
    author: "Sarah Chen",
    role: "Event Director, TechCorp",
    rating: 5
  },
  {
    quote: "Incredibly intuitive interface with powerful planning tools. Couldn't imagine running events without it.",
    author: "Marcus Rodriguez",
    role: "Conference Organizer",
    rating: 5
  },
  {
    quote: "The analytics capabilities helped us optimize our event ROI significantly.",
    author: "Emma Thompson",
    role: "Marketing Lead, StartupCo",
    rating: 5
  }
];

const FEATURES = [
  {
    icon: Globe,
    title: "Global Reach",
    description: "Host events anywhere with our worldwide venue network and multi-language support."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with advanced encryption and compliance features."
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description: "Track engagement, attendance, and ROI with powerful analytics tools."
  }
];

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

const Testimonial = ({ quote, author, role, rating }: TestimonialProps) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <blockquote className="text-gray-700 mb-4">{quote}</blockquote>
    <footer>
      <p className="font-semibold text-gray-900">{author}</p>
      <p className="text-gray-600 text-sm">{role}</p>
    </footer>
  </div>
);

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-900">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] opacity-10 mix-blend-overlay" />
          <div 
            className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.1),transparent_50%)]" 
            aria-hidden="true"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-40 relative">
            <div className="max-w-3xl">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-violet-800/30 text-violet-200 text-sm font-medium mb-6 border border-violet-700/30">
                <Sparkles className="w-4 h-4 mr-2" />
                Revolutionizing Event Management
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-white">
                Create Events That
                <span className="block bg-gradient-to-r from-violet-200 via-fuchsia-200 to-cyan-200 text-transparent bg-clip-text">
                  Leave a Lasting Impact
                </span>
              </h1>
              <p className="text-xl text-violet-100 mb-10 leading-relaxed">
                Transform your event planning with AI-powered tools, real-time analytics, 
                and seamless team collaboration. From conception to execution, we&apos;ve got you covered.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/signup"
                  className="inline-flex items-center justify-center bg-white text-violet-950 px-8 py-4 rounded-lg font-semibold hover:bg-violet-50 transition-all shadow-lg hover:shadow-xl group"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/events"
                  className="inline-flex items-center justify-center bg-violet-800/30 border border-violet-700/50 text-violet-100 px-8 py-4 rounded-lg font-semibold hover:bg-violet-800/40 transition-all"
                >
                  View Events
                </Link>
              </div>
            </div>
          </div>
          
          {/* Stats Section */}
          <div className="border-t border-violet-800/30 bg-violet-900/30 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {STATS.map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="text-3xl font-bold text-white mb-1">{value}</p>
                    <p className="text-violet-200">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Everything You Need for Remarkable Events
              </h2>
              <p className="text-lg text-gray-600">
                Our comprehensive platform provides all the tools you need to plan, 
                execute, and analyze successful events of any scale.
              </p>
            </div>
            <div className="grid lg:grid-cols-3 gap-12">
              {FEATURES.map(({ icon: Icon, title, description }) => (
                <div key={title} className="relative">
                  <div className="bg-violet-100 rounded-2xl p-8">
                    <div className="bg-violet-600 w-12 h-12 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{title}</h3>
                    <p className="text-gray-600">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Trusted by Event Professionals
              </h2>
              <p className="text-lg text-gray-600">
                See what industry leaders are saying about our platform
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((testimonial, index) => (
                <Testimonial key={index} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-violet-900 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Transform Your Events?
            </h2>
            <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of successful event planners who are creating 
              extraordinary experiences with our platform.
            </p>
            <Link 
              href="/signup"
              className="inline-flex items-center justify-center bg-white text-violet-900 px-8 py-4 rounded-lg font-semibold hover:bg-violet-50 transition-all shadow-lg hover:shadow-xl group"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}