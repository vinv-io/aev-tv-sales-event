import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

// Define permissions enum
const PERMISSIONS = {
  // User Management
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  
  // Role Management
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  
  // Event Management
  EVENT_CREATE: 'event:create',
  EVENT_READ: 'event:read',
  EVENT_UPDATE: 'event:update',
  EVENT_DELETE: 'event:delete',
  
  // Product Management
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  
  // Order Management
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  
  // Customer Management
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',
  
  // Reports & Analytics
  REPORTS_READ: 'reports:read',
  ANALYTICS_READ: 'analytics:read',
  
  // System Administration
  SYSTEM_SETTINGS: 'system:settings',
  DATA_MANAGEMENT: 'data:management',
} as const;

const prisma = new PrismaClient();

async function seedAdminAuth() {
  console.log('🔐 Seeding admin authentication system...');

  // Create default roles
  const superAdminRole = await prisma.adminRole.upsert({
    where: { name: 'super_admin' },
    update: {},
    create: {
      name: 'super_admin',
      displayName: 'Super Administrator',
      description: 'Full system access with all permissions',
      permissions: JSON.stringify(Object.values(PERMISSIONS)),
      isActive: true,
    },
  });

  const adminRole = await prisma.adminRole.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
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

  const managerRole = await prisma.adminRole.upsert({
    where: { name: 'manager' },
    update: {},
    create: {
      name: 'manager',
      displayName: 'Manager',
      description: 'Limited admin access for managers',
      permissions: JSON.stringify([
        PERMISSIONS.EVENT_READ,
        PERMISSIONS.EVENT_UPDATE,
        PERMISSIONS.PRODUCT_READ,
        PERMISSIONS.PRODUCT_UPDATE,
        PERMISSIONS.ORDER_READ,
        PERMISSIONS.CUSTOMER_READ,
        PERMISSIONS.REPORTS_READ,
      ]),
      isActive: true,
    },
  });

  const viewerRole = await prisma.adminRole.upsert({
    where: { name: 'viewer' },
    update: {},
    create: {
      name: 'viewer',
      displayName: 'Viewer',
      description: 'Read-only access to system data',
      permissions: JSON.stringify([
        PERMISSIONS.EVENT_READ,
        PERMISSIONS.PRODUCT_READ,
        PERMISSIONS.ORDER_READ,
        PERMISSIONS.CUSTOMER_READ,
        PERMISSIONS.REPORTS_READ,
      ]),
      isActive: true,
    },
  });

  // Create default super admin user
  const hashedPassword = await hash('admin123', 12);
  
  const superAdmin = await prisma.adminUser.upsert({
    where: { email: 'admin@aquavn.com' },
    update: {},
    create: {
      email: 'admin@aquavn.com',
      username: 'superadmin',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      roleId: superAdminRole.id,
      isActive: true,
    },
  });

  // Create a regular admin user for testing
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'manager@aquavn.com' },
    update: {},
    create: {
      email: 'manager@aquavn.com',
      username: 'admin',
      password: hashedPassword, // Same password for demo
      firstName: 'Admin',
      lastName: 'User',
      roleId: adminRole.id,
      isActive: true,
      createdBy: superAdmin.id,
    },
  });

  console.log('✅ Admin authentication system seeded!');
  console.log('📧 Super Admin: admin@aquavn.com / admin123');
  console.log('📧 Admin: manager@aquavn.com / admin123');
  
  return {
    roles: [superAdminRole, adminRole, managerRole, viewerRole],
    users: [superAdmin, adminUser],
  };
}

export { seedAdminAuth };
