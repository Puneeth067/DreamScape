"use client"
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar, Plus, Users, Bell, ChevronRight } from 'lucide-react';
import Head from 'next/head';
import CompleteProfileDialog from '@/components/CompleteProfileDialog';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface Event {
  _id: string;
  title: string;
  datetime: string;
  attendees: Array<{
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    rsvpStatus: 'attending' | 'maybe' | 'declined';
  }>;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

interface DashboardData {
  upcomingEvents: Event[];
  recentActivities: Event[];
}

export default function Dashboard() {
  const { data: session, status, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const { toast } = useToast();
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    upcomingEvents: [],
    recentActivities: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch upcoming events (published status)
        const upcomingResponse = await fetch('/api/events?status=published');
        if (!upcomingResponse.ok) throw new Error('Failed to fetch upcoming events');
        const upcomingEvents = await upcomingResponse.json();

        // Fetch recent activities (completed events)
        const recentResponse = await fetch('/api/events?status=completed');
        if (!recentResponse.ok) throw new Error('Failed to fetch recent activities');
        const recentActivities = await recentResponse.json();

        setDashboardData({
          upcomingEvents: upcomingEvents.slice(0, 5), // Show only 5 upcoming events
          recentActivities: recentActivities.slice(0, 3) // Show only 3 recent activities
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session, toast]);

  useEffect(() => {
    const checkUserProfile = async () => {
      if (session?.user?.email && status === 'authenticated') {
        try {
          const res = await fetch(`/api/user/check?email=${session.user.email}`);
          const data = await res.json();
          
          if (!data.exists && session.user.provider === 'google') {
            setShowProfileDialog(true);
          }
        } catch (error) {
          console.error('Error checking user profile:', error);
        } finally {
          setIsCheckingUser(false);
        }
      }
    };

    if (session?.user && status === 'authenticated') {
      checkUserProfile();
    } else if (status !== 'loading') {
      setIsCheckingUser(false);
    }
  }, [session, status]);

  interface UserData {
    firstName: string;
    lastName: string;
    role: string;
  }

  const handleProfileComplete = async (userData: UserData) => {
    try {
      setShowProfileDialog(false);
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          role: userData.role,
          name: `${userData.firstName} ${userData.lastName}`
        }
      });
      router.refresh();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const formatEventTime = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeDifference = (datetime: string) => {
    const eventTime = new Date(datetime).getTime();
    const currentTime = new Date().getTime();
    const difference = currentTime - eventTime;
    
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} days ago`;
    if (hours > 0) return `${hours} hours ago`;
    return 'Just now';
  };

  if (status === 'loading' || isCheckingUser || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 min-h-screen relative overflow-hidden">
      {/* Abstract shapes background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-1/2 bg-purple-200/20 rounded-full blur-3xl animate-blob"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-1/2 h-1/2 bg-pink-200/20 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 bg-cyan-200/20 rounded-full blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative">
        <Head>
          <title>Dashboard | Dreamscape</title>
        </Head>
        <Toaster />
        
        {session?.user && (
          <>
            <div className="mb-8 bg-white/60 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 border border-white/20">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent animate-gradient-x">
                Welcome back, {session?.user?.name}
              </h1>
              <p className="text-gray-600 mt-3 text-xl font-light">Your event dashboard awaits</p>
            </div>
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/events/create">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none bg-gradient-to-br from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400">
                  <CardContent className="flex items-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500"></div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl mr-4 group-hover:scale-110 transition-transform duration-500">
                      <Plus className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">Create Event</h3>
                      <p className="text-pink-100">Start planning something amazing</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
      
              <Link href="/events">
                <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-none bg-gradient-to-br from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400">
                  <CardContent className="flex items-center p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors duration-500"></div>
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl mr-4 group-hover:scale-110 transition-transform duration-500">
                      <Calendar className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">View Events</h3>
                      <p className="text-purple-100">Manage your events</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
      
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <Card className="border-none bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg p-6">
                    <CardTitle className="text-2xl font-bold text-white flex items-center">
                      <Calendar className="w-6 h-6 mr-2" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {dashboardData.upcomingEvents.length > 0 ? (
                        dashboardData.upcomingEvents.map((event) => (
                          <Link href={`/events/${event._id}`} key={event._id}>
                            <div className="group flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-xl transition-all duration-500 cursor-pointer border border-purple-100/50 hover:border-purple-200 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100">
                              <div>
                                <h4 className="font-semibold text-lg text-purple-900 group-hover:text-purple-700">{event.title}</h4>
                                <p className="text-pink-600">{formatEventTime(event.datetime)}</p>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center text-purple-700 bg-purple-100 px-4 py-2 rounded-full group-hover:bg-purple-200 transition-colors">
                                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                  <span className="font-medium">{event.attendees.length}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-pink-400 group-hover:text-pink-600 group-hover:translate-x-1 transition-all" />
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8 bg-gray-50/50 rounded-xl border border-gray-100">
                          <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>No upcoming events</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
      
              <div>
                <Card className="border-none bg-white/80 backdrop-blur-lg shadow-xl hover:shadow-2xl transition-all duration-500">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg p-6">
                    <CardTitle className="text-2xl font-bold text-white flex items-center">
                      <Bell className="w-6 h-6 mr-2" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {dashboardData.recentActivities.length > 0 ? (
                        dashboardData.recentActivities.map((activity) => (
                          <div key={activity._id} className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50/50 transition-colors">
                            <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl group-hover:scale-105 transition-transform">
                              <Bell className="w-5 h-5 text-cyan-600 group-hover:rotate-12 transition-transform" />
                            </div>
                            <div>
                              <p className="text-gray-800 font-medium group-hover:text-cyan-700 transition-colors">{activity.title} completed</p>
                              <span className="text-sm text-cyan-600">{getTimeDifference(activity.datetime)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-gray-500 py-8 bg-gray-50/50 rounded-xl border border-gray-100">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p>No recent activities</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}

        {showProfileDialog && session?.user && (
          <CompleteProfileDialog
            isOpen={showProfileDialog}
            googleUser={{
              id: session.user.id,
              name: session.user.name,
              email: session.user.email,
              provider: 'google'
            }}
            onProfileComplete={handleProfileComplete}
          />
        )}
      </div>
    </div>
  );
}