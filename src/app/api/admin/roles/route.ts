import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/database/prisma';
import { hasPermission, PERMISSIONS } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.ROLE_READ)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const roles = await prisma.adminRole.findMany({
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(roles);
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.ROLE_CREATE)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { name, displayName, description, permissions } = body;

    // Validate required fields
    if (!name || !displayName || !permissions) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if role name already exists
    const existingRole = await prisma.adminRole.findUnique({
      where: { name },
    });

    if (existingRole) {
      return NextResponse.json({ error: 'Role name already exists' }, { status: 400 });
    }

    // Create role
    const newRole = await prisma.adminRole.create({
      data: {
        name,
        displayName,
        description,
        permissions: JSON.stringify(permissions),
      },
      include: {
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    return NextResponse.json(newRole, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
