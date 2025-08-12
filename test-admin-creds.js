// Test admin login directly
async function testAdminCredentials() {
  console.log('🔐 Testing admin credentials...\n');
  
  // Load environment variables from .env file
  require('dotenv').config({ path: '.env' });
  
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  
  console.log('Environment variables:');
  console.log(`ADMIN_EMAIL: ${adminEmail}`);
  console.log(`ADMIN_PASSWORD: ${adminPassword ? '***' : 'NOT SET'}`);
  
  if (!adminEmail || !adminPassword) {
    console.log('❌ Admin credentials not found in environment');
    return;
  }
  
  // Test the credential verification logic
  const { verifyCredentials } = require('./src/lib/simple-auth.ts');
  
  try {
    const result = await verifyCredentials(adminEmail, adminPassword);
    if (result) {
      console.log('✅ Admin credentials verified successfully');
      console.log('👤 Admin user:', result);
    } else {
      console.log('❌ Admin credentials verification failed');
    }
  } catch (error) {
    console.log('❌ Error testing credentials:', error.message);
  }
}

testAdminCredentials();
