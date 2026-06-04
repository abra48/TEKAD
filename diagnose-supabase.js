// Check which tables still have RLS issues
const url = 'https://qjvpixtoqvpsovohhqtx.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFqdnBpeHRvcXZwc292b2hocXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NzkwMzQsImV4cCI6MjA5NjA1NTAzNH0.BsvZvVUl3iKKM_dv4SsdJ1qp_VrLK4UnrRRyPvUIO5I';

async function checkAll() {
  const tables = ['news_articles', 'categories', 'programs', 'events', 'gallery'];
  
  console.log('=== STATUS TABEL SUPABASE ===\n');
  
  for (const table of tables) {
    const res = await fetch(`${url}/rest/v1/${table}?select=*&limit=10`, {
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Prefer': 'count=exact'
      }
    });
    const range = res.headers.get('content-range');
    const data = await res.json();
    const total = range ? range.split('/')[1] : '?';
    
    if (data.length > 0) {
      console.log(`✅ ${table}: ${data.length} rows (total: ${total})`);
      data.forEach(r => {
        const label = r.title || r.name || r.id;
        console.log(`   → ${label}`);
      });
    } else {
      console.log(`❌ ${table}: 0 rows (total: ${total}) — PERLU FIX RLS!`);
    }
    console.log('');
  }

  // Try inserting a test article to see if INSERT works
  console.log('=== TEST INSERT news_articles ===');
  const insertRes = await fetch(`${url}/rest/v1/news_articles`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      title: 'Test Artikel - Bisa Dihapus',
      slug: 'test-artikel-bisa-dihapus',
      content: 'Ini adalah test untuk memastikan insert bekerja.',
      status: 'published',
      is_featured: false
    })
  });
  const insertData = await insertRes.json();
  
  if (insertRes.ok) {
    console.log('✅ INSERT berhasil! ID:', insertData[0]?.id);
    console.log('   Artinya data SEHARUSNYA muncul di publik.');
    
    // Now try reading it back
    const readRes = await fetch(`${url}/rest/v1/news_articles?select=id,title,status&limit=5`, {
      headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
    });
    const readData = await readRes.json();
    console.log(`\n   Setelah insert, SELECT mengembalikan: ${readData.length} rows`);
    readData.forEach(r => console.log(`   → [${r.status}] ${r.title}`));
  } else {
    console.log('❌ INSERT gagal:', JSON.stringify(insertData));
    console.log('   Ini berarti RLS INSERT policy belum di-set untuk news_articles!');
  }
}

checkAll();
