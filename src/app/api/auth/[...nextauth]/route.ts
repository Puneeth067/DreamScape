// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// Export handlers for GET and POST requests
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);