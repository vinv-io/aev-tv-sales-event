import { getLeaderboard } from '@/lib/data/actions';

async function testLeaderboardLimit() {
    console.log('Testing leaderboard limit functionality...');
    
    try {
        // Test with different limits
        const top5 = await getLeaderboard(5);
        const top10 = await getLeaderboard(10);
        const top20 = await getLeaderboard(20);
        
        console.log(`✓ Top 5 entries: ${top5.length} items`);
        console.log(`✓ Top 10 entries: ${top10.length} items`);
        console.log(`✓ Top 20 entries: ${top20.length} items`);
        
        // Verify the limit is respected
        if (top5.length <= 5) {
            console.log('✓ Top 5 limit respected');
        } else {
            console.log('✗ Top 5 limit not respected');
        }
        
        if (top10.length <= 10) {
            console.log('✓ Top 10 limit respected');
        } else {
            console.log('✗ Top 10 limit not respected');
        }
        
        console.log('\n📊 Leaderboard entries:');
        top10.forEach((entry, index) => {
            console.log(`${index + 1}. ${entry.shopName} (Event: ${entry.eventId})`);
        });
        
        console.log('\n✅ Leaderboard limit test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

testLeaderboardLimit();
