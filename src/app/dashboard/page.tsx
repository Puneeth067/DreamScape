// src/app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';
import Head from 'next/head';
import { DashNav } from "@/components/DashNav";
import { Footer } from "@/components/Footer";

export default function Dashboard() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    },
  });

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Sign In | Dreamscape</title>
      </Head>
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
                  Role: {session.user.role}
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
      <Footer />
      
    </div>
  );
}