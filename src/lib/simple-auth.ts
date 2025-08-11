import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'admin-secret-key');

export interface AdminUser {
  email: string;
  firstName: string;
  lastName: string;
  isAuthenticated: boolean;
}

export async function verifyCredentials(email: string, password: string): Promise<AdminUser | null> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    return null;
  }
  if (email !== adminEmail || password !== adminPassword) {
    return null;
  }
  return {
    email: adminEmail,
    firstName: 'Admin',
    lastName: 'User',
    isAuthenticated: true,
  };
}

export async function createSession(user: AdminUser) {
  const token = await new SignJWT({ user })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret);
  cookies().set('admin-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
  });
}

export async function getSession(): Promise<AdminUser | null> {
  const token = cookies().get('admin-session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.user as AdminUser) || null;
  } catch {
    return null;
  }
}

export async function destroySession() {
  cookies().delete('admin-session');
}
