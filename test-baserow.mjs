// Test Baserow API
const BASEROW_URL = 'https://baserow.automator-doa.com.br/api/database/rows';
const BASEROW_TOKEN = 'WtMbouFANz0Oj9TbOyAMcyLCsV4PyU4o';

console.log('BASEROW_URL:', BASEROW_URL);
console.log('BASEROW_TOKEN:', BASEROW_TOKEN ? '***' + BASEROW_TOKEN.slice(-4) : 'NOT SET');

const path = 'table/745/86/?user_field_names=true';
const fullUrl = `${BASEROW_URL}/${path}`;

console.log('\nFull URL:', fullUrl);

try {
  const res = await fetch(fullUrl, {
    headers: {
      'Authorization': `Token ${BASEROW_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('\nStatus:', res.status);
  
  if (res.ok) {
    const data = await res.json();
    console.log('\nData:', JSON.stringify(data, null, 2).slice(0, 500));
  } else {
    const error = await res.text();
    console.log('\nError:', error);
  }
} catch (err) {
  console.error('\nFetch error:', err.message);
}
