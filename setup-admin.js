const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Define permissions
const PERMISSIONS = {
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',
  ROLE_CREATE: 'role:create',
  ROLE_READ: 'role:read',
  ROLE_UPDATE: 'role:update',
  ROLE_DELETE: 'role:delete',
  EVENT_CREATE: 'event:create',
  EVENT_READ: 'event:read',
  EVENT_UPDATE: 'event:update',
  EVENT_DELETE: 'event:delete',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_READ: 'product:read',
  PRODUCT_UPDATE: 'product:update',
  PRODUCT_DELETE: 'product:delete',
  ORDER_READ: 'order:read',
  ORDER_UPDATE: 'order:update',
  ORDER_DELETE: 'order:delete',
  CUSTOMER_READ: 'customer:read',
  CUSTOMER_UPDATE: 'customer:update',
  CUSTOMER_DELETE: 'customer:delete',
  REPORTS_READ: 'reports:read',
  ANALYTICS_READ: 'analytics:read',
  SYSTEM_SETTINGS: 'system:settings',
  DATA_MANAGEMENT: 'data:management',
};

async function initializeAdminSystem() {
  try {
    console.log('🔐 Initializing admin authentication system...');

    // Create super admin role
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

    // Create admin role
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

    // Create default super admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
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

    // Create admin user
    const adminUser = await prisma.adminUser.upsert({
      where: { email: 'manager@aquavn.com' },
      update: {},
      create: {
        email: 'manager@aquavn.com',
        username: 'admin',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'Manager',
        roleId: adminRole.id,
        isActive: true,
        createdBy: superAdmin.id,
      },
    });

    console.log('✅ Admin system initialized successfully!');
    console.log('📧 Super Admin: admin@aquavn.com / admin123');
    console.log('📧 Admin: manager@aquavn.com / admin123');

    return {
      roles: { superAdminRole, adminRole },
      users: { superAdmin, adminUser }
    };
  } catch (error) {
    console.error('❌ Failed to initialize admin system:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

initializeAdminSystem()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
