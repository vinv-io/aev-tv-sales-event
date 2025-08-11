// Test admin authentication system
console.log('🧪 Testing admin authentication...\n');

// Check environment variables
console.log('Environment variables:');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '[SET]' : '[NOT SET]');
console.log('ADMIN_JWT_SECRET:', process.env.ADMIN_JWT_SECRET ? '[SET]' : '[NOT SET]');
console.log('');

// Test the verifyCredentials function
import { verifyCredentials } from './src/lib/simple-auth';

async function testLogin() {
  try {
    console.log('Testing login with credentials from .env.dev...');
    
    const testEmail = 'admin@aqua.io.vn';
    const testPassword = 'admin123';
    
    console.log(`Attempting login with email: ${testEmail}`);
    console.log(`Using password: ${testPassword}`);
    
    const result = await verifyCredentials(testEmail, testPassword);
    
    if (result) {
      console.log('✅ Login successful!');
      console.log('User data:', result);
    } else {
      console.log('❌ Login failed - Invalid credentials');
      console.log('Expected email:', process.env.ADMIN_EMAIL);
      console.log('Expected password:', process.env.ADMIN_PASSWORD);
    }
    
  } catch (error) {
    console.error('❌ Error during login test:', error);
  }
}

testLogin();
