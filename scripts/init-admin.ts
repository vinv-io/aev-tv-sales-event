import { initializeAdminSystem } from '../src/lib/data/admin-actions';

async function main() {
  try {
    console.log('🚀 Initializing admin system...');
    await initializeAdminSystem();
    console.log('✅ Admin system initialization complete!');
  } catch (error) {
    console.error('❌ Failed to initialize admin system:', error);
    process.exit(1);
  }
}

main();
