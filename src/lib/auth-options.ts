import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          throw new Error('Missing credentials');
        }

        try {
          await connectDB();
          
          // Find user and explicitly select password field
          const user = await User.findOne({ email: credentials.email }).select('+password') as { _id: string, email: string, firstName: string, lastName: string, role: 'Organizer' | 'Co-organizer' | 'Attendee', image?: string, password: string };
          
          if (!user) {
            console.log('User not found:', credentials.email);
            throw new Error('User not found');
          }

          // Verify password using bcrypt compare
          const isValid = await bcrypt.compare(credentials.password, user.password);
          
          if (!isValid) {
            console.log('Invalid password for user:', credentials.email);
            throw new Error('Invalid credentials');
          }

          // Return user without password
          return {
            id: user._id.toString(),
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            image: user.image || undefined
          };
        } catch (error: unknown) {
          console.error('Authorization error:', error);
          throw error;
        }
      }
    })
  ],
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          const existingUser = await User.findOne({ email: user.email }) as { _id: string, email: string, role: 'Organizer' | 'Co-organizer' | 'Attendee' };
          
          if (!existingUser) {
            // Don't create the user yet, let the profile completion handle it
            user.needsProfileCompletion = true;
          } else {
            user.role = existingUser.role;
            user.id = existingUser._id.toString();
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.needsProfileCompletion = user.needsProfileCompletion;
        if (account) {
          token.provider = account.provider;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'Organizer' | 'Co-organizer' | 'Attendee';
        session.user.email = token.email as string;
        session.user.provider = token.provider as string;
        session.user.needsProfileCompletion = token.needsProfileCompletion as boolean;
      }
      return session;
    }
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};