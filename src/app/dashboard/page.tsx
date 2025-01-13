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
    <div className="bg-gradient-to-br from-pink-50 via-purple-50 to-cyan-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Head>
          <title>Dashboard | Dreamscape</title>
        </Head>
        <Toaster />
        
        {session?.user && (
          <>
            <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                Welcome back, {session?.user?.name}
              </h1>
              <p className="text-gray-600 mt-2 text-lg">Here's what's happening with your events</p>
            </div>
      
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Link href="/events/create">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none bg-gradient-to-br from-pink-500 to-rose-500">
                  <CardContent className="flex items-center p-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-white">Create Event</h3>
                      <p className="text-pink-100">Start planning a new event</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
      
              <Link href="/events">
                <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none bg-gradient-to-br from-purple-500 to-indigo-500">
                  <CardContent className="flex items-center p-6">
                    <div className="p-4 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                      <Calendar className="w-6 h-6 text-white" />
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
                <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold text-white">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {dashboardData.upcomingEvents.length > 0 ? (
                        dashboardData.upcomingEvents.map((event) => (
                          <Link href={`/events/${event._id}`} key={event._id}>
                            <div className="flex items-center justify-between p-5 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:shadow-md transition-all duration-300 group cursor-pointer border border-purple-100">
                              <div>
                                <h4 className="font-semibold text-lg text-purple-900">{event.title}</h4>
                                <p className="text-pink-600">{formatEventTime(event.datetime)}</p>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="flex items-center text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
                                  <Users className="w-5 h-5 mr-2" />
                                  <span className="font-medium">{event.attendees.length}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-pink-400 group-hover:text-pink-600 transition-colors" />
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No upcoming events</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
      
              <div>
                <Card className="border-none bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold text-white">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      {dashboardData.recentActivities.length > 0 ? (
                        dashboardData.recentActivities.map((activity) => (
                          <div key={activity._id} className="flex items-start space-x-4">
                            <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-xl">
                              <Bell className="w-5 h-5 text-cyan-600" />
                            </div>
                            <div>
                              <p className="text-gray-800 font-medium">{activity.title} completed</p>
                              <span className="text-sm text-cyan-600">{getTimeDifference(activity.datetime)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-4">No recent activities</p>
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