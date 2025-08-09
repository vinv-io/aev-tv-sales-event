// next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from 'next-auth';
import { AdminRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      role: AdminRole;
      permissions: string[];
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
    permissions: string[];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: AdminRole;
    permissions: string[];
  }
}
