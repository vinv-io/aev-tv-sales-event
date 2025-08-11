import fetch from 'node-fetch';

// Test admin login with environment credentials
async function testAdminLogin() {
  console.log('🔐 Testing Admin Login...');
  
  try {
    const response = await fetch('http://localhost:3000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@aqua.io.vn',
        password: 'admin123'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin login successful:', result);
    } else {
      console.log('❌ Admin login failed:', result);
    }
  } catch (error) {
    console.error('❌ Admin login error:', error);
  }
}

testAdminLogin();
