// Direct REST API test - no Supabase SDK needed
const url = 'https://qjvpixtoqvpsovohhqtx.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdnBpeHRvcXZwc292b2hocXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzkwMzQsImV4cCI6MjA5NjA1NTAzNH0.BsvZvVUl3iKKM_dv4SsdJ1qp_VrLK4UnrRRyPvUIO5I';

async function testTable(table) {
  try {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=5`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'count=exact'
      }
    });
    const total = res.headers.get('content-range');
    const data = await res.json();
    
    if (res.ok) {
      console.log(`\n✅ ${table}: ${data.length} rows returned (range: ${total})`);
      if (data.length > 0) {
        console.log('   Sample:', JSON.stringify(data[0], null, 2).substring(0, 300));
      } else {
        console.log('   ⚠️  TABLE IS EMPTY or RLS is blocking reads!');
      }
    } else {
      console.log(`\n❌ ${table}: HTTP ${res.status}`);
      console.log('   Error:', JSON.stringify(data));
    }
  } catch (err) {
    console.log(`\n❌ ${table}: Network error - ${err.message}`);
  }
}

async function testJoinQuery() {
  try {
    const res = await fetch(
      `${url}/rest/v1/news_articles?select=*,categories(name)&status=eq.published&order=created_at.desc&limit=4`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      }
    );
    const data = await res.json();
    console.log(`\n🔍 EXACT PUBLIC PAGE QUERY (news_articles + categories join):`);
    console.log(`   HTTP Status: ${res.status}`);
    console.log(`   Rows: ${Array.isArray(data) ? data.length : 'ERROR'}`);
    if (Array.isArray(data)) {
      data.forEach(a => console.log(`   - "${a.title}" | category: ${JSON.stringify(a.categories)}`));
    } else {
      console.log('   Response:', JSON.stringify(data));
    }
  } catch (err) {
    console.log('   Network error:', err.message);
  }
}

async function main() {
  console.log('=== SUPABASE REST API DIAGNOSTIC ===');
  console.log(`URL: ${url}`);
  console.log(`Key: ${key.substring(0, 30)}...`);
  
  await testTable('news_articles');
  await testTable('categories');
  await testTable('programs');
  await testTable('events');
  await testTable('gallery');
  await testJoinQuery();
  
  console.log('\n=== DONE ===');
}

main();
