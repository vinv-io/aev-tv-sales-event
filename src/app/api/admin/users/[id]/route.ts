import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/database/prisma';
import { hash } from 'bcryptjs';
import { hasPermission, PERMISSIONS } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.USER_READ)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { id: params.id },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.USER_UPDATE)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { email, username, firstName, lastName, roleId, isActive, password } = body;

    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check for email/username conflicts (excluding current user)
    if (email || username) {
      const conflictUser = await prisma.adminUser.findFirst({
        where: {
          AND: [
            { NOT: { id: params.id } },
            {
              OR: [
                email ? { email } : {},
                username ? { username } : {},
              ].filter(Boolean),
            },
          ],
        },
      });

      if (conflictUser) {
        const conflictField = conflictUser.email === email ? 'email' : 'username';
        return NextResponse.json({ 
          error: `${conflictField.charAt(0).toUpperCase() + conflictField.slice(1)} already exists` 
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (email !== undefined) updateData.email = email;
    if (username !== undefined) updateData.username = username;
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (password) {
      updateData.password = await hash(password, 12);
    }

    const updatedUser = await prisma.adminUser.update({
      where: { id: params.id },
      data: updateData,
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
    const { password: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!hasPermission(session.user.permissions, PERMISSIONS.USER_DELETE)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Check if user exists
    const existingUser = await prisma.adminUser.findUnique({
      where: { id: params.id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent self-deletion
    if (existingUser.id === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    await prisma.adminUser.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
