import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testCheckInFlow() {
  try {
    console.log('🧪 Testing check-in flow...\n');
    
    // 1. Test database connection
    console.log('1. Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');
    
    // 2. Check if we have customers and events
    console.log('2. Checking existing data...');
    const customers = await prisma.customer.findMany();
    const events = await prisma.event.findMany();
    console.log(`Found ${customers.length} customers and ${events.length} events\n`);
    
    if (customers.length === 0) {
      console.log('❌ No customers found. Creating test customer...');
      const testCustomer = await prisma.customer.create({
        data: {
          id: `CUST${Date.now()}`,
          phone: '0123456789',
          shopName: 'Test Shop',
          joined: new Date()
        }
      });
      console.log(`✅ Created test customer: ${testCustomer.id}\n`);
    } else {
      console.log(`✅ Using existing customer: ${customers[0].id}\n`);
    }
    
    if (events.length === 0) {
      console.log('❌ No events found. Check-in requires an active event.');
      return;
    }
    
    // 3. Test check-in creation
    console.log('3. Testing check-in creation...');
    const customer = customers.length > 0 ? customers[0] : await prisma.customer.findFirst();
    const event = events[0];
    
    if (!customer || !event) {
      console.log('❌ Missing customer or event data');
      return;
    }
    
    console.log(`Attempting check-in for customer ${customer.id} in event ${event.id}...`);
    
    const checkInData = {
      customerId: customer.id,
      shopName: customer.shopName,
      phone: customer.phone,
      eventId: event.id,
    };
    
    // Try to create check-in
    const checkIn = await prisma.checkIn.create({
      data: checkInData
    });
    
    console.log('✅ Check-in created successfully!');
    console.log('Check-in details:', {
      customerId: checkIn.customerId,
      shopName: checkIn.shopName,
      phone: checkIn.phone,
      eventId: checkIn.eventId,
      checkInTime: checkIn.checkInTime
    });
    
    // 4. Verify check-in was saved
    console.log('\n4. Verifying check-in was saved...');
    const savedCheckIns = await prisma.checkIn.findMany({
      where: {
        customerId: customer.id,
        eventId: event.id
      }
    });
    
    console.log(`✅ Found ${savedCheckIns.length} check-in(s) for this customer/event combination`);
    
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCheckInFlow();
