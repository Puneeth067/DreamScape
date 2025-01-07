import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role?: 'Organizer' | 'Co-organizer' | 'Attendee';
      image?: string;
      provider?: string;
      needsProfileCompletion?: boolean;
    } & DefaultSession['user']
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role?: 'Organizer' | 'Co-organizer' | 'Attendee';
    image?: string;
    provider?: string;
    needsProfileCompletion?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: 'Organizer' | 'Co-organizer' | 'Attendee';
    provider?: string;
    needsProfileCompletion?: boolean;
  }
}