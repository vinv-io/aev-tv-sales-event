// Comprehensive System Test
console.log('🧪 Running comprehensive system tests...\n');

async function runTests() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('1. Testing Admin Login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@aqua.io.vn',
        password: 'admin123'
      })
    });
    
    if (loginResponse.ok) {
      console.log('✅ Admin login works');
    } else {
      const error = await loginResponse.text();
      console.log('❌ Admin login failed:', error);
    }
  } catch (error) {
    console.log('❌ Admin login error:', error.message);
  }

  console.log('\n2. Testing Active Events API...');
  try {
    const eventsResponse = await fetch(`${baseUrl}/api/events`);
    if (eventsResponse.ok) {
      const events = await eventsResponse.json();
      console.log('✅ Events API works, found', events.length, 'events');
      if (events.length > 0) {
        console.log('📅 Sample event date format:', events[0].startDate);
      }
    } else {
      console.log('❌ Events API failed');
    }
  } catch (error) {
    console.log('❌ Events API error:', error.message);
  }

  console.log('\n3. Testing Customer Creation...');
  try {
    const customerResponse = await fetch(`${baseUrl}/api/customers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '0123456789',
        shopName: 'Test Shop'
      })
    });
    
    if (customerResponse.ok) {
      const customer = await customerResponse.json();
      console.log('✅ Customer creation works');
    } else {
      console.log('❌ Customer creation failed');
    }
  } catch (error) {
    console.log('❌ Customer creation error:', error.message);
  }

  console.log('\n✨ Tests completed!');
}

// Add fetch polyfill for Node.js
if (typeof fetch === 'undefined') {
  console.log('Installing fetch polyfill...');
  global.fetch = require('node-fetch');
}

runTests().catch(console.error);
