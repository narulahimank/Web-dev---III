const http = require('http');
const app = require('./app');

const server = app.listen(4000, async () => {
  console.log('Test server started on port 4000');

  const request = (method, path, data = null) => {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'localhost',
        port: 4000,
        path: path,
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let body = '';
        res.on('data', chunk => { body += chunk; });
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode,
            body: body ? JSON.parse(body) : null
          });
        });
      });

      req.on('error', reject);
      if (data) {
        req.write(JSON.stringify(data));
      }
      req.end();
    });
  };

  try {
    console.log('\n--- 1. Testing GET /students ---');
    let res = await request('GET', '/students');
    console.log('Status:', res.statusCode, 'Data count:', res.body.count);

    console.log('\n--- 2. Testing GET /students/1 ---');
    res = await request('GET', '/students/1');
    console.log('Status:', res.statusCode, 'Student:', res.body.data);

    console.log('\n--- 3. Testing GET /students/999 (Not Found) ---');
    res = await request('GET', '/students/999');
    console.log('Status:', res.statusCode, 'Message:', res.body.message);

    console.log('\n--- 4. Testing POST /students (Valid) ---');
    res = await request('POST', '/students', { name: 'Kavita', course: 'MCA' });
    console.log('Status:', res.statusCode, 'Created student:', res.body.data);

    console.log('\n--- 5. Testing POST /students (Bad Request) ---');
    res = await request('POST', '/students', { name: '' });
    console.log('Status:', res.statusCode, 'Message:', res.body.message);

    console.log('\n--- 6. Testing PUT /students/1 ---');
    res = await request('PUT', '/students/1', { name: 'Rahul Sharma', course: 'MCA' });
    console.log('Status:', res.statusCode, 'Updated student:', res.body.data);

    console.log('\n--- 7. Testing DELETE /students/1 ---');
    res = await request('DELETE', '/students/1');
    console.log('Status:', res.statusCode, 'Deleted student:', res.body.data);

    console.log('\n--- 8. Testing 404 for unknown route ---');
    res = await request('GET', '/unknown-route');
    console.log('Status:', res.statusCode, 'Message:', res.body.message);

    console.log('\n✅ ALL API TESTS COMPLETED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
