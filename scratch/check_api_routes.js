const https = require('https');

async function testRoute(path, payload) {
  return new Promise((resolve) => {
    const urlObj = new URL('https://cds.flipcodesolutions.com/api' + path);
    const data = JSON.stringify(payload);
    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({ path, status: res.statusCode, body });
      });
    });

    req.on('error', (e) => resolve({ path, error: e.message }));
    req.write(data);
    req.end();
  });
}

async function run() {
  const routes = [
    '/leads/bulk-store',
    '/leads/bulk_store',
    '/leads/bulk-create',
    '/leads/bulk-import',
    '/leads/import',
    '/leads/import-excel',
    '/leads/excel-import',
    '/import-leads',
    '/lead-import',
    '/leads-import',
    '/leads/multiple',
    '/leads/insert-many'
  ];

  for (const r of routes) {
    const res = await testRoute(r, {
      leads: [{ name: 'Test', phone: '9999999999', model_variant: 'Test Car' }],
      data: [{ name: 'Test', phone: '9999999999', model_variant: 'Test Car' }]
    });
    console.log(`${r} -> Status ${res.status}: ${res.body?.slice(0, 120)}`);
  }
}

run();
