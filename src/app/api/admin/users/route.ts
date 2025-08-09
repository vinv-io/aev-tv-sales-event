import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/database/prisma';
import { hash } from 'bcryptjs';
import { hasPermission, PERMISSIONS } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.USER_READ)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const users = await prisma.adminUser.findMany({
      include: {
        role: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.USER_CREATE)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, username, password, firstName, lastName, roleId } = body;

    // Validate required fields
    if (!email || !username || !password || !firstName || !lastName || !roleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if email or username already exists
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email },
          { username },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json({ 
        error: existingUser.email === email ? 'Email already exists' : 'Username already exists' 
      }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create user
    const newUser = await prisma.adminUser.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        roleId,
        createdBy: session.user.id,
      },
      include: {
        role: true,
        creator: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(userWithoutPassword, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
