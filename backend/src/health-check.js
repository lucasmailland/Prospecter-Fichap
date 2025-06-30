const https = require('https');

// Always use HTTPS for security - no HTTP fallback
// Configure for both production and development environments
const options = {
  hostname: process.env.HEALTH_CHECK_HOST || 'localhost',
  port: process.env.HEALTH_CHECK_PORT || 443,
  path: '/health',
  method: 'GET',
  timeout: 5000,
  // Allow self-signed certificates in development only
  rejectUnauthorized: process.env.NODE_ENV === 'production',
  // Additional security headers
  headers: {
    'User-Agent': 'HealthCheck/1.0',
    'Accept': 'application/json',
  }
};

console.log(`🔒 Starting secure HTTPS health check on ${options.hostname}:${options.port}${options.path}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🛡️ Certificate validation: ${options.rejectUnauthorized ? 'STRICT' : 'RELAXED (dev only)'}`);

const request = https.request(options, (res) => {
  let data = '';
  
  // Collect response data
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`📊 Health check status: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      console.log('✅ Health check passed - Application is healthy');
      try {
        const responseData = JSON.parse(data);
        console.log('📋 Health data:', responseData);
      } catch (e) {
        console.log('📋 Health response:', data.substring(0, 100));
      }
      process.exit(0);
    } else {
      console.error(`❌ Health check failed with status: ${res.statusCode}`);
      console.error('📄 Response body:', data);
      process.exit(1);
    }
  });
});

request.on('error', (err) => {
  console.error('❌ HTTPS health check failed:', err.message);
  console.error('🔍 Error details:', err.code);
  
  // Provide helpful troubleshooting information
  if (err.code === 'ECONNREFUSED') {
    console.error('💡 Troubleshooting: Server may not be running or port may be incorrect');
    console.error(`   Check if application is listening on port ${options.port}`);
  } else if (err.code === 'CERT_HAS_EXPIRED' || err.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
    console.error('💡 Troubleshooting: SSL certificate issue');
    console.error('   For development, set NODE_ENV=development to allow self-signed certificates');
  } else if (err.code === 'ENOTFOUND') {
    console.error('💡 Troubleshooting: Hostname resolution failed');
    console.error(`   Check if ${options.hostname} is correct`);
  }
  
  process.exit(1);
});

request.on('timeout', () => {
  console.error(`❌ Health check timeout after ${options.timeout}ms`);
  console.error('💡 Troubleshooting: Application may be slow to respond');
  request.destroy();
  process.exit(1);
});

// Set timeout and handle it properly
request.setTimeout(options.timeout);

// Send the request
request.end(); 