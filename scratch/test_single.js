const https = require('https');

async function testSingle() {
  const payload = {
    name: 'Verification Lead',
    phone: '9876543210',
    model_variant: 'Hyundai Creta',
    vehicle_segment: '4 Wheeler',
    priority: 'Hot'
  };

  const data = JSON.stringify(payload);
  const options = {
    hostname: 'cds.flipcodesolutions.com',
    port: 443,
    path: '/api/leads',
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
      console.log('Single POST /api/leads status:', res.statusCode);
      console.log('Response:', body);
    });
  });

  req.on('error', (e) => console.error('Error:', e));
  req.write(data);
  req.end();
}

testSingle();
