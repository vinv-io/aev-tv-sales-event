import { getActiveEvents } from '@/lib/data/actions';

async function testGetActiveEvents() {
  try {
    console.log('🧪 Testing getActiveEvents() function...\n');
    
    const activeEvents = await getActiveEvents();
    
    console.log(`Found ${activeEvents.length} active events:\n`);
    
    activeEvents.forEach((event, index) => {
      console.log(`${index + 1}. Event ID: ${event.id}`);
      console.log(`   Name: ${JSON.stringify(event.name)}`);
      console.log(`   Start Date: ${event.startDate}`);
      console.log(`   End Date: ${event.endDate}`);
      console.log(`   Status: ${event.status}`);
      console.log('');
    });
    
    if (activeEvents.length === 0) {
      console.log('❌ No active events returned by getActiveEvents()');
    } else {
      console.log('✅ getActiveEvents() is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Error testing getActiveEvents():', error);
  }
}

testGetActiveEvents();
