// src/app/dashboard/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { DashNav } from "@/components/DashNav";
import { DashFooter } from "@/components/DashFooter";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <DashNav />
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      <DashFooter />
    </SessionProvider>
  );
}