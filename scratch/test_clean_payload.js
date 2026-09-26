const https = require('https');

async function testCleanPayload() {
  const payload = {
    name: 'Rohit Sharma',
    phone: '9876501234',
    email: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    birth_date: null,
    anniversary_date: null,
    vehicle_segment: '4 Wheeler',
    brand_id: null,
    brand_name: 'Tata',
    model_variant: 'Harrier Dark Edition',
    priority: 'Hot',
    purchase_timeline: 'Immediate (Within 7 Days)',
    budget: 2200000,
    total_deal_amount: 2200000,
    source_id: null,
    source_name: 'Excel Import',
    status_id: null,
    status_name: 'New Lead',
    assigned_user_name: undefined
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
    let b = '';
    res.on('data', c => b += c);
    res.on('end', () => {
      console.log('Status:', res.statusCode);
      try {
        const json = JSON.parse(b);
        console.log('Success:', json.status, 'ID:', json.data?.id);
        // Clean up immediately
        if (json.data?.id) {
          const delReq = https.request({
            hostname: 'cds.flipcodesolutions.com',
            port: 443,
            path: `/api/leads/${json.data.id}`,
            method: 'DELETE',
            headers: { 'Accept': 'application/json' }
          }, (delRes) => console.log('Cleaned up test lead ID', json.data.id, 'status:', delRes.statusCode));
          delReq.end();
        }
      } catch {
        console.log('Body:', b);
      }
    });
  });

  req.write(data);
  req.end();
}

testCleanPayload();
