'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if the current route is public
    const isPublicRoute = ['/', '/auth/login', '/auth/signup'].includes(pathname);
    
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    setIsLoading(false);

    // Redirect logic
    if (!session && !isPublicRoute) {
      router.push('/auth/login');
    } else if (session && isPublicRoute && pathname !== '/') {
      router.push('/dashboard');
    }
  }, [session, status, pathname, router]);

  const value = {
    isAuthenticated: !!session,
    isLoading,
    user: session?.user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);