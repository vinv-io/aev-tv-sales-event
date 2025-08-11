import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';

const prisma = new PrismaClient();

// ...existing code...

// Create the default roles and admin user
export async function initializeAdminSystem() {
  try {
    // Check if super admin role exists
    const existingRole = await prisma.adminRole.findFirst({
      where: { name: 'super_admin' }
    });

    if (existingRole) {
      console.log('Admin system already initialized');
      return;
    }

    // Create default roles
    const superAdminRole = await prisma.adminRole.create({
      data: {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full system access with all permissions',
        permissions: JSON.stringify(Object.values(PERMISSIONS)),
        isActive: true,
      },
    });

    const adminRole = await prisma.adminRole.create({
      data: {
        name: 'admin',
        displayName: 'Administrator',
        description: 'General admin with most permissions',
        permissions: JSON.stringify([
          PERMISSIONS.EVENT_CREATE,
          PERMISSIONS.EVENT_READ,
          PERMISSIONS.EVENT_UPDATE,
          PERMISSIONS.EVENT_DELETE,
          PERMISSIONS.PRODUCT_CREATE,
          PERMISSIONS.PRODUCT_READ,
          PERMISSIONS.PRODUCT_UPDATE,
          PERMISSIONS.PRODUCT_DELETE,
          PERMISSIONS.ORDER_READ,
          PERMISSIONS.ORDER_UPDATE,
          PERMISSIONS.CUSTOMER_READ,
          PERMISSIONS.CUSTOMER_UPDATE,
          PERMISSIONS.REPORTS_READ,
          PERMISSIONS.ANALYTICS_READ,
        ]),
        isActive: true,
      },
    });

    // Create default super admin user
    const hashedPassword = await hash('admin123', 12);
    
    const superAdmin = await prisma.adminUser.create({
      data: {
        email: 'admin@aquavn.com',
        username: 'superadmin',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        roleId: superAdminRole.id,
        isActive: true,
      },
    });

    console.log('✅ Admin system initialized!');
    console.log('📧 Super Admin: admin@aquavn.com / admin123');
    
    return { superAdminRole, adminRole, superAdmin };
  } catch (error) {
    console.error('❌ Failed to initialize admin system:', error);
    throw error;
  }
}

// Utility functions for admin management
export async function createAdminUser(data: {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  roleId: string;
  createdBy: string;
}) {
  const hashedPassword = await hash(data.password, 12);
  
  return prisma.adminUser.create({
    data: {
      ...data,
      password: hashedPassword,
    },
    include: {
      role: true,
    },
  });
}

export async function getAllAdminUsers() {
  return prisma.adminUser.findMany({
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
}

export async function getAllAdminRoles() {
  return prisma.adminRole.findMany({
    include: {
      users: {
        select: {
          id: true,
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
}

export async function updateAdminUser(id: string, data: {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  roleId?: string;
  isActive?: boolean;
}) {
  return prisma.adminUser.update({
    where: { id },
    data,
    include: {
      role: true,
    },
  });
}

export async function deleteAdminUser(id: string) {
  return prisma.adminUser.delete({
    where: { id },
  });
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    return null;
  }

  const isPasswordValid = await compare(password, user.password);
  
  if (!isPasswordValid) {
    return null;
  }

  // Update last login
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    permissions: JSON.parse(user.role.permissions),
  };
}

// Permission helpers
export function hasPermission(userPermissions: string[], requiredPermission: string): boolean {
  return userPermissions.includes(requiredPermission);
}

export function hasAllPermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every(permission => userPermissions.includes(permission));
}

export function hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some(permission => userPermissions.includes(permission));
}
