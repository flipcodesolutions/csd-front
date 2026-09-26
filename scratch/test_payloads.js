const https = require('https');

async function testPost(urlPath, payload) {
  return new Promise((resolve) => {
    const data = JSON.stringify(payload);
    const req = https.request({
      hostname: 'cds.flipcodesolutions.com',
      port: 443,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    }, (res) => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ path: urlPath, status: res.statusCode, body: b }));
    });
    req.on('error', e => resolve({ path: urlPath, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function run() {
  const item = {
    name: 'Bulk Check Lead',
    phone: '9876543210',
    model_variant: 'Hyundai Creta',
    vehicle_segment: '4 Wheeler',
    priority: 'Hot'
  };

  const tests = [
    { desc: 'Raw Array on /leads', path: '/api/leads', payload: [item] },
    { desc: 'Object with leads on /leads', path: '/api/leads', payload: { leads: [item] } },
    { desc: 'Object with data on /leads', path: '/api/leads', payload: { data: [item] } },
    { desc: 'Object with items on /leads', path: '/api/leads', payload: { items: [item] } },
    { desc: '/api/import/leads', path: '/api/import/leads', payload: { leads: [item] } },
    { desc: '/api/leads/import-data', path: '/api/leads/import-data', payload: { leads: [item] } },
    { desc: '/api/lead/bulk', path: '/api/lead/bulk', payload: { leads: [item] } },
    { desc: '/api/leads/bulk-insert', path: '/api/leads/bulk-insert', payload: { leads: [item] } },
  ];

  for (const t of tests) {
    const res = await testPost(t.path, t.payload);
    console.log(`${t.desc} -> ${res.status}: ${res.body.slice(0, 150)}`);
  }
}

run();
