// src/app/dashboard/layout.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <div className="min-h-screen bg-slate-50">
        {children}
      </div>
    </SessionProvider>
  );
}