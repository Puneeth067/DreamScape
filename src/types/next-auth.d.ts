// Updated next-auth.d.ts types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'Organizer' | 'Co-organizer' | 'Attendee';
      image?: string;
      provider?: string;
    }
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'Organizer' | 'Co-organizer' | 'Attendee';
    image?: string;
    provider?: string;
  }
}

export const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);