"use client"
import { useSession } from 'next-auth/react';
import { redirect, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import Head from 'next/head';
import { DashNav } from "@/components/DashNav";
import { DashFooter } from "@/components/DashFooter";
import CompleteProfileDialog from '@/components/CompleteProfileDialog';
import { Toaster } from "@/components/ui/toaster";

export default function Dashboard() {
  const { data: session, status, update: updateSession } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const router = useRouter();

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
      
      // Update the session
      await updateSession({
        ...session,
        user: {
          ...session?.user,
          role: userData.role,
          name: `${userData.firstName} ${userData.lastName}`
        }
      });

      // Force a router refresh
      router.refresh();
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  if (status === 'loading' || isCheckingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Dashboard | Dreamscape</title>
      </Head>
      <Toaster />
      <DashNav />
      
      <Card className="max-w-2xl px-auto mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Dashboard</CardTitle>
        </CardHeader>
        
        {session?.user && (
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-violet-50 rounded-lg">
              <div className="p-3 bg-violet-100 rounded-full">
                <User className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome, {session.user.name}
                </h2>
                <p className="text-gray-600">
                  Role: {session.user.role || 'Not Set'}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

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
      
      <DashFooter />
    </div>
  );
}